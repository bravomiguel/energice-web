import { unstable_noStore as noStore } from 'next/cache';

import DeleteAccountBtn from '@/components/buttons/delete-account-btn';
import SignOutBtn from '@/components/buttons/sign-out-btn';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import H2 from '@/components/h2';
import PlungeStatsSection from '@/components/plunge-stats-section';
import StartPlungeSection from '@/components/start-plunge-section';
import PlungePlansSection from '@/components/plunge-plans-section';
import ProfileSettings from '@/components/profile-settings';
import { checkAuth, getProfileById } from '@/lib/server-utils';
import PlungeOffersSection from '@/components/plunge-credits-section';

export default async function Page() {
  noStore();

  const user = await checkAuth();
  const profile = await getProfileById(user.id);

  let isOnboarded = true;
  if (!profile.phone || !profile.name || !profile.isWaiverSigned) {
    isOnboarded = false;
  }

  return (
    <>
      <main className="relative flex-1 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          {true ? (
            <>
              <H1>Hey {`Miguel`}</H1>{' '}
              <Subtitle>{`Let's get you feeling great 🚀`}</Subtitle>
            </>
          ) : (
            <H1>{`Let's get you feeling great 🚀`}</H1>
          )}
        </div>

        <PlungeStatsSection isOnboarded={isOnboarded} />

        <StartPlungeSection
          isOnboarded={isOnboarded}
          freeCredits={profile.freeCredits}
          isMember={!!profile.isMember}
        />

        <PlungePlansSection
          isOnboarded={isOnboarded}
          isMember={!!profile.isMember}
          stripeCustomerId={profile?.stripeCustomerId ?? ''}
          memberPeriodEnd={profile.memberPeriodEnd}
          memberPayFailed={profile.memberPayFailed}
          memberRenewing={profile.memberRenewing}
        />

        <PlungeOffersSection isOnboarded={isOnboarded} />

        <section>
          <H2 className="mb-3">Settings</H2>
          <ProfileSettings
            name={profile.name}
            waiverSignedAt={profile.waiverSignedAt}
            waiverSigName={profile.waiverSigName}
            isOnboarded={isOnboarded}
          />
        </section>

        <section className="flex flex-col w-full gap-2">
          <SignOutBtn />
          <DeleteAccountBtn />
        </section>
      </main>
      <footer className="flex flex-col gap-1 items-center border-t-2 border-zinc-200 pt-4 pb-8 mt-8">
        <Subtitle className="text-zinc-700">Logged in as</Subtitle>
        <p className="text-sm text-zinc-600">{user.email}</p>
      </footer>
    </>
  );
}
