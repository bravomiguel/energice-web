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
import FreeCreditModal from '@/components/free-credit-modal';
import PlungeOffersSection from '@/components/plunge-offers-section';
import { Badge } from '@/components/ui/badge';
import Sweat440MembershipSection from '@/components/sweat440-membership-section';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function Page() {
  noStore();

  const user = await checkAuth();
  const profile = await getProfileById(user.id);

  const isSweat440Member = !!profile.sweat440MemberEmail;

  const totalFreeCredits =
    profile.freeCredits + Number(profile.hasS440MemberCredit);

  let isOnboarded = true;
  if (!profile.phone || !profile.name || !profile.isWaiverSigned) {
    isOnboarded = false;
  }

  // get number of times founding member coupon has been redeemed
  let foundingMemberRedemptions: number | undefined;
  try {
    const coupon = await stripe.coupons.retrieve(
      process.env.COUPON_FOUNDING_MEMBER,
    );
    foundingMemberRedemptions = coupon.times_redeemed;
    // console.log({ coupon });
  } catch (e) {
    console.error(e);
  }

  // console.log({ foundingMemberRedemptions });

  return (
    <>
      <main className="relative flex-1 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          {profile.name ? (
            <>
              <H1>Hey {profile.name?.split(' ')[0]}</H1>{' '}
              <Subtitle>{`Let's get you feeling great 🚀`}</Subtitle>
              {isSweat440Member && (
                <Badge className="w-fit mt-1 bg-indigo-900 hover:bg-indigo-900/90 uppercase flex gap-1">
                  {/* <Sweat440ShieldWhite className="h-4 w-4" /> */}
                  SWEAT440 Member
                </Badge>
              )}
            </>
          ) : (
            <H1>{`Let's get you feeling great 🚀`}</H1>
          )}
        </div>

        <PlungeStatsSection isOnboarded={isOnboarded} />

        <StartPlungeSection
          isOnboarded={isOnboarded}
          freeCredits={totalFreeCredits}
          isMember={profile.isMember}
          isSweat440Member={isSweat440Member}
        />

        <PlungePlansSection
          isOnboarded={isOnboarded}
          isMember={profile.isMember}
          stripeCustomerId={profile?.stripeCustomerId ?? ''}
          memberPeriodEnd={profile.memberPeriodEnd}
          memberPayFailed={profile.memberPayFailed}
          memberRenewing={profile.memberRenewing}
          isSweat440Member={isSweat440Member}
          foundingMemberRedemptions={foundingMemberRedemptions ?? null}
        />

        <PlungeOffersSection
          isOnboarded={isOnboarded}
          isSweat440Member={isSweat440Member}
        />

        <Sweat440MembershipSection
          isOnboarded={isOnboarded}
          isSweat440Member={isSweat440Member}
        />

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

        {/* <FreeCreditModal freeCredits={profile.freeCredits} /> */}
      </main>
      <footer className="flex flex-col gap-1 items-center border-t-2 border-zinc-200 pt-4 pb-8 mt-8">
        <Subtitle className="text-zinc-700">Logged in as</Subtitle>
        <p className="text-sm text-zinc-600">{user.email}</p>
      </footer>
    </>
  );
}
