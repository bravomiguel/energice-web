import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import DeleteAccountBtn from '@/components/buttons/delete-account-btn';
import SignOutBtn from '@/components/buttons/sign-out-btn';
// import {
//   checkAuth,
//   getUserById,
// } from '@/lib/server-utils';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import H2 from '@/components/h2';
import PlungeStatsSection from '@/components/plunge-stats-section';
import StartPlungeSection from '@/components/start-plunge-section';
import PlungePlansSection from '@/components/plunge-plans-section';
import ProfileSettings from '@/components/profile-settings';
import { isUserOver18 } from '@/lib/utils';

export default async function Page() {
  noStore();

  // auth check
  // const session = await checkAuth();
  // const user = await getUserById(session.user.id);

  // onboarded check
  // if (!user?.isEmailConfirmed) redirect('/confirm-email');
  // if (!user?.firstName) redirect('/member-details');
  // if (!user.isWaiverSigned) redirect('/waiver');
  let isOnboarded = true;
  // if (
  //   !user?.isEmailConfirmed ||
  //   !user?.firstName ||
  //   (!user.isWaiverSigned && isOver18) ||
  //   (!user?.isGWaiverSigned && !isOver18)
  // ) {
  //   isOnboarded = false;
  // }

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
          hasFreeCredit={false}
          paidCredits={0}
          isMember={false}
        />

        <PlungePlansSection
          isOnboarded={isOnboarded}
          isMember={false}
          customerId={''}
          memberPeriodEnd={null}
          memberPayFailed={null}
          memberRenewing={null}
        />

        <section>
          <H2 className="mb-3">Settings</H2>
          <ProfileSettings
            firstName={'Miguel'}
            lastName={'Bravo'}
            waiverSignedAt={null}
            waiverSigName={null}
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
        <p className="text-sm text-zinc-600">{'miguelbravobalestrini@gmail.com'}</p>
      </footer>
    </>
  );
}
