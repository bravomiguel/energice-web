'use server';

import { z } from 'zod';
// import { AuthError } from 'next-auth';
import {
  Seam,
  isSeamActionAttemptFailedError,
  isSeamActionAttemptTimeoutError,
} from 'seam';
import { Unit } from '@prisma/client';

import {
  checkAuth,
  checkPlungeSession,
  getCodesbyLockId,
  getUnitById,
} from '@/lib/server-utils';
import { getTimeDiffSecs, sleep } from '@/lib/utils';

const seam = new Seam();

export async function createLockCode(data: {
  lockDeviceId: Unit['lockDeviceId'];
  minsLaterEndTime: number;
}) {
  // auth check
  await checkAuth();

  // validation check
  const validatedData = z
    .object({
      lockDeviceId: z.string().trim().min(1),
      minsLaterEndTime: z.number().positive(),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { lockDeviceId, minsLaterEndTime } = validatedData.data;

  // create code action
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + minsLaterEndTime * 60 * 1000);
  const code = String(Math.floor(1000 + Math.random() * 9000));

  try {
    await seam.accessCodes.create({
      device_id: lockDeviceId,
      name: `code ${code}`,
      starts_at: startTime.toISOString(),
      ends_at: endTime.toISOString(),
      code,
    });
  } catch (e) {
    return {
      error: 'Failed to create code',
    };
  }
}

export async function getLatestEligibleCode(data: { unitId: Unit['id'] }) {
  // auth check
  await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      data: null,
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId } = validatedData.data;

  let lockDeviceId;
  // get unit's lock id
  try {
    const unit = await getUnitById(unitId);
    if (!unit)
      return {
        data: null,
        error: 'Unit does not exist',
      };
    lockDeviceId = unit.lockDeviceId;
  } catch (e) {
    return {
      data: null,
      error: 'Failed to find unit',
    };
  }

  // get eligible codes
  let eligibleCodes;
  try {
    const codes = await getCodesbyLockId(lockDeviceId);
    eligibleCodes = codes
      .filter((code: any) => code.status === 'set')
      .filter((code) => code.type === 'time_bound')
      .filter((code) => {
        if (!code.ends_at) return false;
        const now = new Date();
        const endsAt = new Date(code.ends_at);
        const timeDiffSecs = getTimeDiffSecs(now, endsAt);
        if (!timeDiffSecs) return false;
        return timeDiffSecs >= 60;
      });

    if (eligibleCodes.length === 0) {
      return {
        data: null,
        error: 'No code available',
      };
    }
  } catch (e) {
    return {
      data: null,
      error: 'Failed to get codes',
    };
  }

  // return latest eligible code
  return {
    data: eligibleCodes.at(-1),
    error: null,
  };
}

export async function unlockAction(data: { unitId: Unit['id'] }) {
  // auth check
  const user = await checkAuth();

  // validation check
  const validatedData = z
    .object({
      unitId: z.string().trim().min(1),
    })
    .safeParse(data);

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
    };
  }

  const { unitId } = validatedData.data;

  // valid session check (i.e. paid for, and within time limit)
  const { data: plungeSession, status: plungeStatus } =
    await checkPlungeSession(user.id);
  if (plungeStatus === 'none_valid') {
    return {
      error: 'No valid session found',
    };
  }

  if (plungeSession && plungeSession.unitId !== unitId) {
    return {
      error: 'Not authorized to unlock this plunge',
    };
  }

  // get unit's lock id
  let lockDeviceId;
  try {
    const unit = await getUnitById(unitId);
    if (!unit)
      return {
        error: 'Unit does not exist',
      };
    lockDeviceId = unit.lockDeviceId;
  } catch (e) {
    return {
      error: 'Failed to find unit',
    };
  }

  // unlock action
  if (
    process.env.VERCEL_ENV === 'development' ||
    process.env.PREVIEW_ENV === 'preview' ||
    process.env.PREVIEW_ENV === 'preview-pay'
  ) {
    await sleep(8000);
    return;
  } else if (
    process.env.VERCEL_ENV === 'production' ||
    process.env.PREVIEW_ENV === 'preview-lock'
  ) {
    // unlock unit
    try {
      const actionResponse = await seam.locks.unlockDoor(
        { device_id: lockDeviceId },
        {
          waitForActionAttempt: {
            pollingInterval: 1000,
            timeout: 60000,
          },
        },
      );

      await seam.actionAttempts.get({
        action_attempt_id: actionResponse.action_attempt_id,
      });
    } catch (e) {
      if (isSeamActionAttemptFailedError(e)) {
        return {
          error: 'Unlocking unsuccessful, try again',
        };
      }
      if (isSeamActionAttemptTimeoutError(e)) {
        return {
          error: 'Locking took too long',
        };
      }
      return {
        error: 'Unlocking unsuccessful, please try again',
      };
    }
  }
}
