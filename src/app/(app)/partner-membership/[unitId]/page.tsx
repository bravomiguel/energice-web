import { redirect } from 'next/navigation';

import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import { checkAuth, getProfileById } from '@/lib/server-utils';
import Sweat440Logo from '@/components/logos/sweat440-logo';
import PartnerMemberForm from '@/components/forms/sweat440-member-form';
import { Unit } from '@prisma/client';

export default async function Page({
  params: { unitId },
  searchParams,
}: {
  params: { unitId: Unit['id'] };
  searchParams: Promise<{ navToUnit?: string }>;
}) {
  const params = await searchParams;
  const navToUnit = params.navToUnit === 'true';

  const user = await checkAuth();
  const profile = await getProfileById(user.id);

  if (!!profile.sweat440MemberEmail) redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Sweat440Logo className="w-36" />
        <H1>Confirm Membership</H1>
        <Subtitle>
          Enter the email you used for your membership at SWEAT440 Austin
          Highland
        </Subtitle>
      </div>
      <PartnerMemberForm unitId={unitId} navToUnit={navToUnit} />
    </main>
  );
}
