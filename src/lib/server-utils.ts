import 'server-only';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth-no-edge';
import { Session, Unit, User } from '@prisma/client';
import prisma from './db';
import { Seam } from 'seam';
import { isWithinTimeLimit } from './utils';
import { APP_PATHNAMES } from './constants';

// --- auth utils ---

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin');
  }

  return session;
}

export async function authCallbackRedirect({
  id: userId,
  authCallbackUrl,
}: Pick<User, 'id' | 'authCallbackUrl'>) {
  if (authCallbackUrl) {
    // clear callback from db
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { authCallbackUrl: null },
      });
    } catch (e) {
      return {
        error: 'Failed to run callback url',
      };
    }

    const isCallbackUrlAllowed =
      APP_PATHNAMES.filter((pathName) => authCallbackUrl.includes(pathName))
        .length > 0;

    if (isCallbackUrlAllowed) {
      redirect(authCallbackUrl);
    }
  }
}

// --- user utils ---

export async function getUserById(userId: User['id']) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function getUserByEmail(userEmail: User['email']) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail, deleted: false },
  });
  return user;
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

export async function getSessionsByUserId(userId: Session['id']) {
  const sessions = await prisma.session.findMany({ where: { userId } });
  return sessions;
}

export async function checkPlungeSession(userId: User['id']): Promise<{
  data: Session | null;
  status: 'valid_started' | 'valid_not_started' | 'none_valid';
}> {
  const paidSession = await prisma.session.findFirst({
    where: { userId, hasPaid: true },
    orderBy: { createdAt: 'desc' },
  });

  const isSessionValid =
    paidSession && isWithinTimeLimit(paidSession.createdAt, 11);
  const hasSessionStarted =
    paidSession?.sessionStart &&
    isWithinTimeLimit(paidSession?.sessionStart, 10);
  const hasSessionEnded = paidSession?.sessionEnd;

  if (isSessionValid && hasSessionStarted && !hasSessionEnded) {
    return {
      data: paidSession,
      status: 'valid_started',
    };
  } else if (isSessionValid && !hasSessionStarted) {
    return {
      data: paidSession,
      status: 'valid_not_started',
    };
  } else {
    return {
      data: null,
      status: 'none_valid',
    };
  }
}
