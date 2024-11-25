'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Session, Unit } from '@prisma/client';

import prisma from '@/lib/db';
import { plungeTimerSecsSchema } from '@/lib/validations';
import { checkAuth, getProfileById, getSessionById } from '@/lib/server-utils';

export async function createSession(data: {
  unitId: Unit['id'];
  plungeTimerSecs: Session['plungeTimerSecs'];
}) {
  // auth check
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
      plungeTimerSecs: plungeTimerSecsSchema,
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
      data: null,
    };
  }

  const { unitId, plungeTimerSecs } = validatedData.data;

  // create new session
  let newSession;
  try {
    newSession = await prisma.session.create({
      data: { profileId: user.id, unitId, plungeTimerSecs },
    });
  } catch (e) {
    // console.log(e);
    return {
      error: 'Failed to create new session',
      data: null,
    };
  }

  return {
    error: null,
    data: { newSessionId: newSession.id },
  };
}

export async function applyFreeCredit(data: { sessionId: Session['id'] }) {
  // auth check
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sessionId } = validatedData.data;

  // authorization check
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession) {
    return {
      error: 'Session not found',
    };
  }
  if (plungeSession.profileId !== user.id) {
    return {
      error: 'Not authorized',
    };
  }

  // check how many free credits left
  const profile = await getProfileById(user.id);

  if (profile.freeCredits > 0) {
    // decrement free credits balance by 1.
    try {
      await prisma.profile.update({
        where: { id: user.id },
        data: {
          freeCredits: { decrement: 1 },
        },
      });
    } catch (e) {
      console.error(e);
      return {
        error: 'Failed to apply free credit.',
      };
    }
  }

  if (profile.freeCredits === 0) {
    // set extra credit to false
    try {
      await prisma.profile.update({
        where: { id: user.id },
        data: {
          hasS440MemberCredit: false,
        },
      });
    } catch (e) {
      console.error(e);
      return {
        error: 'Failed to apply free credit.',
      };
    }
  }

  // mark session with free credit flag
  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        hasUsedFreeCredit: true,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply free credit',
    };
  }

  // redirect to unlock screen
  redirect(`/session/${sessionId}/unlock`);
}

export async function applyUnlimited(data: { sessionId: Session['id'] }) {
  // auth check
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sessionId } = validatedData.data;

  // authorization check
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession) {
    return {
      error: 'Session not found',
    };
  }
  if (plungeSession.profileId !== user.id) {
    return {
      error: 'Not authorized',
    };
  }

  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        hasUsedUnlimited: true,
      },
    });
  } catch (e) {
    return {
      error: 'Failed to apply unlimited membership',
    };
  }

  // redirect to unlock screen
  redirect(`/session/${sessionId}/unlock`);
}

export async function startSession(data: { sessionId: Session['id'] }) {
  // auth check
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sessionId } = validatedData.data;

  // authorization check
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession) {
    return {
      error: 'Session not found',
    };
  }
  if (plungeSession.profileId !== user.id) {
    return {
      error: 'Not authorized',
    };
  }

  // update start date
  try {
    const sessionStart = new Date();
    await prisma.session.update({
      where: { id: sessionId },
      data: { sessionStart },
    });
  } catch (e) {
    return {
      error: 'Failed to start session',
    };
  }

  // redirect to session screen
  redirect(`/session/${sessionId}`);
}

export async function endSession(data: {
  sessionId: Session['id'];
  totalPlungeSecs: Session['totalPlungeSecs'];
}) {
  // auth check
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      sessionId: z.string().trim().min(1),
      totalPlungeSecs: z.number(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { sessionId, totalPlungeSecs } = validatedData.data;

  // authorization check
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession) {
    return {
      error: 'Session not found',
    };
  }
  if (plungeSession.profileId !== user.id) {
    return {
      error: 'Not authorized',
    };
  }

  // update session in db
  try {
    const sessionEnd = new Date();
    await prisma.session.update({
      where: { id: sessionId },
      data: { sessionEnd, totalPlungeSecs },
    });
  } catch (e) {
    return {
      error: 'Failed to end session',
    };
  }

  // redirect to session screen
  redirect(`/session/${sessionId}/close`);
}
