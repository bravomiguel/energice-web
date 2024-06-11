import 'server-only';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { Unit, User } from '@prisma/client';
import prisma from './db';
import { Seam } from 'seam';

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
