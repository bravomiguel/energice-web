'use client';

import { BsFillBox2HeartFill } from 'react-icons/bs';
import { FaInfinity } from 'react-icons/fa6';
import { MdOutlineAutorenew } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import H2 from './h2';
import CheckoutBtn from './buttons/checkout-btn';
import {
  billingPortalSession,
  subscriptionCheckoutSession,
} from '@/lib/actions/payment-actions';
import { Profile } from '@prisma/client';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';

export default function PlungePlansSection({
  isOnboarded,
  isMember,
  stripeCustomerId,
  memberPeriodEnd,
  memberPayFailed,
  memberRenewing,
  isSweat440Member,
}: {
  isOnboarded: boolean;
  isMember: boolean;
  stripeCustomerId: string;
  memberPeriodEnd?: Profile['memberPeriodEnd'];
  memberPayFailed?: Profile['memberPayFailed'];
  memberRenewing?: Profile['memberRenewing'];
  isSweat440Member?: Profile['isSweat440Member'];
}) {
  if (!isOnboarded) return null;

  if (memberPayFailed)
    return (
      <section>
        <H2 className="mb-3">Memberships</H2>
        <div className="space-y-3">
          {/* <PlungeOption /> */}
          <ManageSubscriptionOption
            stripeCustomerId={stripeCustomerId}
            memberPayFailed={memberPayFailed}
            memberPeriodEnd={memberPeriodEnd}
            memberRenewing={memberRenewing}
          />
          {/* <PackOption /> */}
          {/* <SubscriptionOption /> */}
        </div>
      </section>
    );

  if (isMember)
    return (
      <section>
        <H2 className="mb-3">Membership</H2>
        <ManageSubscriptionOption
          stripeCustomerId={stripeCustomerId}
          memberPeriodEnd={memberPeriodEnd}
          memberRenewing={memberRenewing}
        />
      </section>
    );

  if (isSweat440Member) {
    return (
      <section className="space-y-4">
        <H2 className="mb-3">Memberships</H2>
        <MembershipCard
          isSweat440Member={isSweat440Member}
          sweat440MemberOption={true}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Memberships</H2>
      <Carousel className="w-full mx-auto relative z-10">
        <CarouselContent>
          <CarouselItem className="basis-5/6">
            <MembershipCard sweat440MemberOption={true} />
          </CarouselItem>
          <CarouselItem className="basis-5/6">
            <MembershipCard sweat440MemberOption={false} />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function MembershipCard({
  isSweat440Member,
  sweat440MemberOption,
}: {
  isSweat440Member?: boolean;
  sweat440MemberOption: boolean;
}) {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className="mt-3 pb-3">
        <div className="w-full bg-sky-900 absolute top-0 left-0 px-6 py-1 text-zinc-100 uppercase text-sm">
          {sweat440MemberOption ? `Sweat440 Highland Members` : `Non-Members`}
        </div>
        <div className="flex gap-2 items-center">
          {isSweat440Member && (
            <div className="relative flex items-center justify-center h-min w-min">
              <BsFillBox2HeartFill className="h-5 w-5 fill-sky-700" />
              <div className="h-2.5 w-2 bg-sky-700 absolute translate-y-1" />
              <FaInfinity className="h-3 w-3 fill-cyan-100 absolute translate-y-0.5" />
            </div>
          )}
          <CardTitle>Unlimited Plunges</CardTitle>
        </div>
        <CardDescription className="text-sm">
          Unlimited cold plunge sessions each month.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 pb-4">
        <p className="text-3xl font-semibold">
          {sweat440MemberOption ? `US$99` : `US$149`}
        </p>
        <p className="text-xs text-zinc-600">
          Auto-renews each month. Cancel any time.
        </p>
      </CardContent>
      <CardFooter>
        <CheckoutBtn
          className="bg-sky-800 hover:bg-sky-800/90 w-full"
          checkoutAction={subscriptionCheckoutSession}
        >
          Get unlimited
        </CheckoutBtn>
      </CardFooter>
    </Card>
  );
}

function ManageSubscriptionOption({
  stripeCustomerId,
  memberPayFailed,
  memberPeriodEnd,
  memberRenewing,
}: {
  stripeCustomerId: string;
  memberPayFailed?: boolean;
  memberPeriodEnd?: Profile['memberPeriodEnd'];
  memberRenewing?: Profile['memberRenewing'];
}) {
  return (
    <Alert
      className={cn('bg-sky-100 text-zinc-700 pr-10 pt-5 flex gap-2', {
        'bg-red-100 border-red-800': memberPayFailed,
      })}
    >
      <div className="relative flex items-center justify-center h-min w-min">
        <BsFillBox2HeartFill
          className={cn('h-5 w-5 fill-sky-800', {
            'fill-red-800': memberPayFailed,
          })}
        />
        <div
          className={cn('h-2.5 w-2 bg-sky-800 absolute translate-y-1', {
            'bg-red-800': memberPayFailed,
          })}
        />
        <FaInfinity
          className={cn('h-3 w-3 fill-sky-100 absolute translate-y-0.5', {
            'fill-red-100': memberPayFailed,
          })}
        />
      </div>
      <div className="space-y-3 w-full">
        <AlertTitle>Unlimited Member</AlertTitle>
        <AlertDescription>
          {memberPayFailed
            ? `The last subscription payment failed. Please review your billing details.`
            : `You've got unlimited access! Manage your billing details below.`}
        </AlertDescription>
        {memberPeriodEnd && !memberPayFailed ? (
          <AlertDescription className="flex gap-1 w-full justify-end items-center">
            <span className="font-semibold">
              {memberRenewing ? `Renews on ` : `Cancels on `}
              {memberPeriodEnd.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
              })}
            </span>
            {memberRenewing ? (
              <MdOutlineAutorenew className="h-5 w-5" />
            ) : (
              <IoMdTime className="h-5 w-5" />
            )}
          </AlertDescription>
        ) : null}
        <div className="flex flex-col w-full">
          <CheckoutBtn
            className={cn('bg-sky-800 hover:bg-sky-800/90', {
              'bg-red-800 hover:bg-red-800/90': memberPayFailed,
            })}
            checkoutAction={async () =>
              await billingPortalSession({ stripeCustomerId })
            }
          >
            Manage billing
          </CheckoutBtn>
        </div>
      </div>
    </Alert>
  );
}
