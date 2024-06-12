import { unstable_noStore as noStore } from 'next/cache';
import { Unit } from '@prisma/client';

import {
  checkActivePlungeSession,
  checkAuth,
  getUnitById,
} from '@/lib/server-utils';
import { getLatestActiveCode } from '@/actions/actions';
import H1 from '@/components/h1';
import { getTimeDiffSecs } from '@/lib/utils';
import UnlockDisplay from '@/components/unlock-display';

export default async function Page({
  params,
}: {
  params: { unitId: Unit['id'] };
}) {
  noStore();
  // auth check
  const session = await checkAuth();

  // session active check
  await checkActivePlungeSession(session.user.id);

  // get unit
  const unit = await getUnitById(params.unitId);
  if (!unit) {
    // redirect('/');
    console.error('Unit not found');
    return;
  }

  // get newest active code
  const response = await getLatestActiveCode({
    lockDeviceId: unit.lockDeviceId,
  });
  // console.log({ response });
  if (response.error) {
    console.error(response.error);
  }

  const activeCode = response?.data ?? null;
  const now = new Date();
  const endsAt = activeCode?.ends_at ? new Date(activeCode?.ends_at) : null;
  const secsLeft = getTimeDiffSecs(now, endsAt);

  if (activeCode) {
    // 1) Fire "create session" server action which
    // a) creates new session in db, for specific user and unit
    // b) marks new session flag as active
    // c) returns new session id
  }

  // 2) if there is no session id, or error, return error message / screen

  // 3) feed session id into "session starting" client component which starts 10s countdown, and then
  // 4) when countdown ends, client component fires "navigate to session" server action which
  // a) sets session end time in db, to 10m2s in future, and
  // b) navigates to dynamic session screen using session id

  return (
    <main className="flex-1 flex flex-col gap-10">
      <H1>Unlock Plunge</H1>

      <UnlockDisplay
        className="flex-1 flex flex-col gap-10"
        code={activeCode && activeCode.code}
        secsLeft={secsLeft}
        lockDeviceId={unit.lockDeviceId}
        unitId={params.unitId}
      />
    </main>
  );
}
