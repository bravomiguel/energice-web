import 'server-only';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth-no-edge';
import { Session, Unit, User } from '@prisma/client';
import prisma from './db';
import { Seam } from 'seam';
import { isWithinTimeLimit } from './utils';

// --- auth utils ---

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin');
  }

  return session;
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
  const lock = await seam.locks.get({
    device_id: deviceId,
  });
  return lock;
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

export async function getSessionsByUserId(userId: User['id']) {
  const sessions = await prisma.session.findMany({ where: { userId } });
  return sessions;
}

export async function checkActivePlungeSession(userId: User['id']): Promise<{
  data: Session | null;
  status: 'started' | 'active' | 'no_active';
}> {
  const activePlungeSession = await prisma.session.findFirst({
    where: { userId, isActive: true },
  });
  if (activePlungeSession) {
    if (activePlungeSession.sessionStart) {
      if (isWithinTimeLimit(activePlungeSession.sessionStart, 10)) {
        // redirect(`/session/${activePlungeSession.id}`);
        return {
          data: activePlungeSession,
          status: 'started',
        };
      } else {
        await prisma.session.update({
          where: { id: activePlungeSession.id },
          data: { isActive: false },
        });

        return {
          data: activePlungeSession,
          status: 'no_active',
        };
      }
    } else if (isWithinTimeLimit(activePlungeSession.createdAt, 12)) {
      // redirect(`/plunge/${activePlungeSession.unitId}/unlock`);
      return {
        data: activePlungeSession,
        status: 'active',
      };
    } else {
      await prisma.session.update({
        where: { id: activePlungeSession.id },
        data: { isActive: false },
      });

      return {
        data: activePlungeSession,
        status: 'no_active',
      };
    }
  }

  return {
    data: null,
    status: 'no_active',
  };
}
