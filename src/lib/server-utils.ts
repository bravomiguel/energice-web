import 'server-only';
import { redirect } from 'next/navigation';

import { Session, Unit, Profile } from '@prisma/client';
import prisma from './db';
import { Seam } from 'seam';
import { isWithinTimeLimit } from './utils';
import { createServerClient } from './supabase/server';
import { User } from '@supabase/supabase-js';
import { signOut } from './actions/auth-actions';

// --- auth utils ---

export async function checkAuth() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error(error.code + ' ' + error.message);
    redirect('/signin');
  }

  return data.user;
}

// --- user utils ---

export async function getUserProfileById(profileId: Profile['id']) {
  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  return profile;
}

export async function getUserByEmail(userEmail: Profile['email']) {
  const user = await prisma.profile.findUnique({
    where: { email: userEmail, deleted: false },
  });
  return user;
}

export async function getProfileById(userId: User['id']) {
  // get profile
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile) {
    await signOut();
    redirect('/signin');
  }

  return profile;
}

// --- unit utils ---

const seam = new Seam();

export async function getAllUnits() {
  const units = await prisma.unit.findMany();
  return units;
}

export async function getUnitById(unitId: Unit['id']) {
  const unit = await prisma.unit.findUnique({ where: { id: unitId } });
  return unit;
}

export async function getLockByLockId(deviceId: Unit['lockDeviceId']) {
  let lock;
  try {
    lock = await seam.locks.get({
      device_id: deviceId,
    });
  } catch (e) {
    return {
      error: 'Lock not found',
      data: null,
    };
  }

  return {
    error: null,
    data: lock,
  };
}

export async function getCodesbyLockId(deviceId: Unit['lockDeviceId']) {
  const codes = await seam.accessCodes.list({ device_id: deviceId });
  return codes;
}

// --- session utils ---

export async function getSessionById(sessionId: Session['id']) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  return session;
}

export async function getSessionsByprofileId(profileId: Session['id']) {
  const sessions = await prisma.session.findMany({ where: { profileId } });
  return sessions;
}

export async function checkPlungeSession(profileId: Profile['id']): Promise<{
  data: Session | null;
  status: 'valid_started' | 'valid_not_started' | 'none_valid';
}> {
  // get latest authorized session (i.e. paid for, or used credit, or unlimited membership)
  const authorizedSession = await prisma.session.findFirst({
    where: {
      profileId,
      OR: [
        { hasPaid: true },
        { hasUsedUnlimited: true },
        { hasUsedFreeCredit: true },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  const isSessionValid =
    authorizedSession && isWithinTimeLimit(authorizedSession.createdAt, 11);
  const hasSessionStarted =
    authorizedSession?.sessionStart &&
    isWithinTimeLimit(authorizedSession?.sessionStart, 10);
  const hasSessionEnded = authorizedSession?.sessionEnd;

  if (isSessionValid && hasSessionStarted && !hasSessionEnded) {
    return {
      data: authorizedSession,
      status: 'valid_started',
    };
  } else if (isSessionValid && !hasSessionStarted) {
    return {
      data: authorizedSession,
      status: 'valid_not_started',
    };
  } else {
    return {
      data: null,
      status: 'none_valid',
    };
  }
}
