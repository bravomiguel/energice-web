import 'server-only';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { User } from '@prisma/client';
import prisma from './db';

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin');
  }

  return session;
}

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
