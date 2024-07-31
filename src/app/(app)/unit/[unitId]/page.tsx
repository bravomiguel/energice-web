import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { IoLocationOutline } from 'react-icons/io5';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';
import { Unit } from '@prisma/client';

import {
  checkPlungeSession,
  checkAuth,
  getLockByLockId,
  getUnitById,
  getUserById,
  authCallbackRedirect,
} from '@/lib/server-utils';
import H1 from '@/components/h1';
import Image from 'next/image';
// import { createLockCode } from '@/actions/actions';
import Subtitle from '@/components/subtitle';
import UnitDetails from '@/components/unit-details';
import { cn } from '@/lib/utils';
import FreeCreditModal from '@/components/free-credit-modal';

export default async function Page({
  params: { unitId },
}: {
  params: { unitId: Unit['id'] };
}) {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // redirect to reset password page
  if (user?.email === 'resetpassword@koldup.com') redirect('/reset-password');

  // onboarded check
  if (!user?.isEmailConfirmed) redirect('/confirm-email');
  if (!user?.firstName) redirect('/member-details');
  if (!user.isWaiverSigned) redirect('/waiver');

  // redirect to auth callback, if relevant
  await authCallbackRedirect({
    id: session.user.id,
    authCallbackUrl: user.authCallbackUrl,
  });

  // valid session check (i.e. paid for / used credit, and within time limit)
  const { data: plungeSession, status: plungeSessionStatus } =
    await checkPlungeSession(session.user.id);
  // redirect to session screen, if session is valid and has already started
  if (plungeSession && plungeSessionStatus === 'valid_started') {
    redirect(`/session/${plungeSession.id}`);
  } else if (plungeSession && plungeSessionStatus === 'valid_not_started') {
    // redirect to session unlock screen, if session not started yet
    redirect(`/session/${plungeSession.id}/unlock`);
  }

  // get unit
  const unit = await getUnitById(unitId);
  if (!unit) {
    redirect('/');
  }

  // get unit lock
  const lock = await getLockByLockId(unit.lockDeviceId);
  // console.log({lockProperties: lock.data?.properties});
  let unitStatus: 'Ready' | 'Offline' | 'In use' = 'Ready';
  if (
    process.env.VERCEL_ENV === 'production'
    // || process.env.PREVIEW_ENV === 'preview-lock'
  ) {
    unitStatus =
      lock.data === null
        ? 'Offline'
        : !lock.data.properties.online
        ? 'Offline'
        : !lock.data.properties.locked
        ? 'In use'
        : 'Ready';
  }

  const hostGMapsUrl = `https://www.google.com/maps/search/?api=1&query=${unit.hostAddress
    .toLowerCase()
    .replace(' ', '+')}/&query_place_id=${unit.hostGMapsPlaceId}`;

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>{unit.hostName}</H1>
        <Link
          href={hostGMapsUrl}
          target="_blank"
          className="flex gap-1 items-center text-zinc-500"
        >
          <IoLocationOutline className="w-4 h-4" />
          <Subtitle className="text-sm max-w-10/12 truncate">
            {unit.hostAddress}
          </Subtitle>
          <LiaExternalLinkAltSolid className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-1">
        <PlungeStatus unitStatus={unitStatus} />
        <PlungeImage imageUrl={unit.imageUrl} />
      </div>
      <FreeCreditModal hasFreeCredit={user.hasFreeCredit} />
      <UnitDetails
        unitId={unitId}
        unitStatus={unitStatus}
        paidCredits={user.paidCredits}
        hasFreeCredit={user.hasFreeCredit}
      />
    </main>
  );
}

function PlungeStatus({
  unitStatus,
}: {
  unitStatus: 'Offline' | 'In use' | 'Ready';
}) {
  return (
    <div className="flex gap-1.5 ml-0.5 -mt-2 items-center -translate-y-0.5">
      <div
        className={cn('h-2.5 w-2.5 rounded-full bg-green-400', {
          'bg-zinc-400': unitStatus === 'Offline',
          'bg-amber-400': unitStatus === 'In use',
        })}
      ></div>
      <p className="text-xs font-medium text-zinc-500">{unitStatus}</p>
    </div>
  );
}

function PlungeImage({ imageUrl }: { imageUrl: Unit['imageUrl'] }) {
  return (
    <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
      <Image
        src={imageUrl}
        alt="cold plunge image"
        // className="max-w-full max-h-full"
        width={300}
        height={50}
        className="w-full"
      />
    </div>
  );
}
