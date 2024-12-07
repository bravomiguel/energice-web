// import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { IoLocationOutline } from 'react-icons/io5';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';
import { Unit } from '@prisma/client';

import {
  checkPlungeSession,
  checkAuth,
  getUnitById,
  getOrCreateProfileById,
} from '@/lib/server-utils';
import H1 from '@/components/h1';
import Image from 'next/image';
import Subtitle from '@/components/subtitle';
import UnitDetails from '@/components/unit-details';

export default async function Page({
  params: { unitId },
  searchParams,
}: {
  params: { unitId: Unit['id'] };
  searchParams: Promise<{ sweat440Member?: string }>;
}) {
  const params = await searchParams;
  const sweat440MemberOption = params.sweat440Member === 'true';

  // auth check
  const user = await checkAuth();
  const profile = await getOrCreateProfileById(user.id);

  // onboarded check
  if (!profile?.name) redirect('/member-details');
  if (!profile.isWaiverSigned) redirect('/waiver');

  // valid session check (i.e. paid for / used credit, and within time limit)
  const { data: plungeSession, status: plungeSessionStatus } =
    await checkPlungeSession(user.id);
  // redirect to session screen, if session is valid and has already started
  if (plungeSession && plungeSessionStatus === 'valid_started') {
    redirect(`/session/${plungeSession.id}`);
  } 

  // get unit
  const unit = await getUnitById(unitId);
  if (!unit) {
    redirect('/');
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
      <PlungeImage imageUrl={unit.imageUrl} />
      <UnitDetails
        unitId={unitId}
        freeCredits={profile.freeCredits}
        isMember={profile.isMember}
        // isMember={true}
        sweat440MemberOption={sweat440MemberOption}
      />
    </main>
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
        priority={true}
      />
    </div>
  );
}
