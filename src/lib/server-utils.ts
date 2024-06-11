import 'server-only';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { Unit, User } from '@prisma/client';
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

export async function getSessionsByUserId(userId: User['id']) {
  const sessions = await prisma.session.findMany({ where: { userId } });
  return sessions;
}

export async function checkActivePlungeSession(
  userId: User['id'],
) {
  const activePlungeSession = await prisma.session.findFirst({
    where: { userId, isActive: true },
  });
  if (activePlungeSession) {
    if (isWithinTimeLimit(activePlungeSession.createdAt, 11)) {
      redirect(`/session/${activePlungeSession.id}`);
    } else {
      await prisma.session.update({
        where: { id: activePlungeSession.id },
        data: { isActive: false },
      });
    }
  }
}
