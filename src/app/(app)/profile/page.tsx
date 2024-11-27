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
import { checkAuth, getOrCreateProfileById } from '@/lib/server-utils';
import FreeCreditModal from '@/components/free-credit-modal';
import PlungeOffersSection from '@/components/plunge-offers-section';
import { Badge } from '@/components/ui/badge';
import Sweat440MembershipSection from '@/components/sweat440-membership-section';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IoArrowUndoSharp } from 'react-icons/io5';
import OnboardReturnBtn from '@/components/buttons/onboard-return-btn';
import Image from 'next/image';
import { BsFillBox2HeartFill } from 'react-icons/bs';
import { BsLightningChargeFill } from 'react-icons/bs';
import { RiWaterFlashFill } from 'react-icons/ri';
import { Profile } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Infinity, Tickets } from 'lucide-react';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prelaunchView = process.env.PRELAUNCH_VIEW === 'true';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  noStore();

  const params = await searchParams;
  const subscriptionSuccess = params.success === 'true';

  const user = await checkAuth();
  const profile = await getOrCreateProfileById(user.id);

  const isSweat440Member = !!profile.sweat440MemberEmail;

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
                  SWEAT440 Member
                </Badge>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <H1>{`Let's get you feeling great 🚀`}</H1>
              {isSweat440Member && (
                <Badge className="w-fit mt-1 bg-indigo-900 hover:bg-indigo-900/90 uppercase flex gap-1">
                  SWEAT440 Member
                </Badge>
              )}
            </div>
          )}
        </div>

        {prelaunchView && (
          <section className="space-y-4">
            <H2 className="mb-3">Coming Soon</H2>
            <ComingSoonCard />
          </section>
        )}

        {!isOnboarded && (
          <section className="space-y-4">
            <H2 className="mb-3">Onboarding</H2>
            <CompleteOnboardingCard
              isNameSaved={!!profile.name}
              isWaiverSigned={profile.isWaiverSigned}
            />
          </section>
        )}

        {!prelaunchView && <PlungeStatsSection isOnboarded={isOnboarded} />}

        {!prelaunchView && (
          <StartPlungeSection
            isOnboarded={isOnboarded}
            freeCredits={profile.freeCredits}
            isMember={profile.isMember}
            isSweat440Member={isSweat440Member}
          />
        )}

        {prelaunchView && isOnboarded && (
          <section>
            <H2 className="mb-3">Start Plunge</H2>
            <StartNewPlungeCard
              freeCredits={profile.freeCredits}
              isMember={profile.isMember}
            />
          </section>
        )}

        <PlungePlansSection
          // isOnboarded={isOnboarded}
          isMember={profile.isMember}
          stripeCustomerId={profile?.stripeCustomerId ?? ''}
          memberPeriodEnd={profile.memberPeriodEnd}
          memberPayFailed={profile.memberPayFailed}
          memberRenewing={profile.memberRenewing}
          isSweat440Member={isSweat440Member}
          foundingMemberRedemptions={foundingMemberRedemptions ?? null}
          subscriptionSuccess={subscriptionSuccess}
        />

        {!prelaunchView && (
          <PlungeOffersSection
            isOnboarded={isOnboarded}
            isSweat440Member={isSweat440Member}
            hasS440MemberCredit={profile.hasS440MemberCredit}
          />
        )}

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

function ComingSoonCard() {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className="py-5">
        <div className="flex gap-2 items-center">
          <BsLightningChargeFill className="h-5 w-5 fill-indigo-800" />
          <CardTitle>The Ultimate Recovery Experience </CardTitle>
        </div>
        <CardDescription className="text-sm">
          Landing at SWEAT440 Austin Highland <br /> on Dec 1st
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 space-y-5">
        <div className="w-full h-52 rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
          <Image
            src={'/coming-soon.png'}
            alt="cold plunge image"
            width={300}
            height={50}
            className="w-full"
            priority={true}
          />
        </div>
        <div className="flex gap-2">
          <BsFillBox2HeartFill className="h-5 w-5 fill-indigo-700" />
          <p className="text-sm">
            <span className="font-semibold">Launch Promo:</span> Free unlimited
            plunges from Dec 1st - 7th!
          </p>
        </div>
      </CardContent>
      <CardFooter className="pb-5"></CardFooter>
    </Card>
  );
}
function CompleteOnboardingCard({
  isNameSaved,
  isWaiverSigned,
}: {
  isNameSaved: boolean;
  isWaiverSigned: boolean;
}) {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className="pt-5 pb-3">
        <div className="flex gap-2 items-center">
          <IoArrowUndoSharp className="h-5 w-5 fill-indigo-800" />
          <CardTitle>Complete onboarding</CardTitle>
        </div>
        <CardDescription className="text-sm">
          {`You've just got a couple more steps left to start plunging`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2"></CardContent>
      <CardFooter className="pb-5">
        <OnboardReturnBtn
          className="w-full"
          isNameSaved={isNameSaved}
          isWaiverSigned={isWaiverSigned}
        >
          Return to onboarding
        </OnboardReturnBtn>
      </CardFooter>
    </Card>
  );
}

function StartNewPlungeCard({
  freeCredits,
  isMember,
}: {
  freeCredits: Profile['freeCredits'];
  isMember: Profile['isMember'];
}) {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-300/50">
      <CardHeader className="pt-5 pb-3">
        <div className="flex gap-2 items-center">
          <RiWaterFlashFill className="h-5 w-5 fill-zinc-400/90" />
          <CardTitle className="text-zinc-400/90">Plunge Session</CardTitle>
        </div>
        <CardDescription className="text-sm text-zinc-400">
          Energice your life. Start plunging from Dec 1st!
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2"></CardContent>
      <CardFooter className="pb-5">
        <div className="flex flex-col w-full gap-3">
          <Button className="w-full text-zinc-200 bg-zinc-400/50 hover:bg-zinc-400/50 cursor-not-allowed">
            Start on Dec 1st
          </Button>
          <div
            className={cn(
              'font-semibold text-sm flex items-center justify-between w-full text-zinc-400/90',
              { 'justify-end': freeCredits > 0 && !isMember },
            )}
          >
            {isMember && (
              <div className="flex gap-2 items-center">
                <p>Unlimited</p>
                <Infinity className="h-5 w-5" />
              </div>
            )}
            {freeCredits > 0 && (
              <div className="flex gap-2 items-center">
                <p>
                  {freeCredits === 1
                    ? `1 free credit`
                    : `${freeCredits} free credits`}
                </p>
                <Tickets className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
