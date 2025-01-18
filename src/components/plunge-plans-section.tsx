'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { BsFillBox2HeartFill } from 'react-icons/bs';
import { FaInfinity } from 'react-icons/fa6';
import { MdOutlineAutorenew } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';

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

type TPlungePlansSection = {
  isMember: boolean;
  stripeCustomerId: string;
  memberPeriodEnd?: Profile['memberPeriodEnd'];
  memberPayFailed?: Profile['memberPayFailed'];
  memberRenewing?: Profile['memberRenewing'];
  isSweat440Member?: boolean;
  foundingMemberRedemptions: number | null;
  subscriptionSuccess: boolean;
  nonmemberCheckout: boolean;
};

export default function PlungePlansSection({
  isMember,
  stripeCustomerId,
  memberPeriodEnd,
  memberPayFailed,
  memberRenewing,
  isSweat440Member,
  subscriptionSuccess,
  nonmemberCheckout,
}: TPlungePlansSection) {
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (subscriptionSuccess) {
      timerId = setTimeout(() => {
        toast.success(`You're an Energice Unlimited Member!`);
      });
    }

    return () => {
      if (subscriptionSuccess) {
        clearTimeout(timerId);
      }
    };
  }, []);

  useEffect(() => {
    const handleCheckout = async () => {
      if (nonmemberCheckout) {
        await subscriptionCheckoutSession({ sweat440MemberOption: false });
      }
    };
    handleCheckout();
  }, [nonmemberCheckout]);

  if (memberPayFailed)
    return (
      <section>
        <H2 className="mb-3">Memberships</H2>
        <div className="space-y-3">
          <ManageSubscriptionOption
            stripeCustomerId={stripeCustomerId}
            memberPayFailed={memberPayFailed}
            memberPeriodEnd={memberPeriodEnd}
            memberRenewing={memberRenewing}
          />
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
          sweat440MemberOption={true}
          isSweat440Member={isSweat440Member}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Memberships</H2>
      <Carousel className="w-full mx-auto relative z-10">
        <CarouselContent>
          <CarouselItem className="basis-[87%]">
            <MembershipCard
              sweat440MemberOption={true}
              isSweat440Member={isSweat440Member}
            />
          </CarouselItem>
          <CarouselItem className="basis-[87%]">
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
        <div className="w-full bg-cyan-900 absolute top-0 left-0 px-6 py-1 text-zinc-100 uppercase text-xs">
          {sweat440MemberOption ? `Sweat440 Highland Members` : `Non-Members`}
        </div>
        <div className="flex gap-2 items-center">
          {isSweat440Member && (
            <div className="relative flex items-center justify-center h-min w-min">
              <BsFillBox2HeartFill className="h-5 w-5 fill-cyan-700" />
              <div className="h-2.5 w-2 bg-cyan-700 absolute translate-y-1" />
              <FaInfinity className="h-3 w-3 fill-cyan-100 absolute translate-y-0.5" />
            </div>
          )}
          <CardTitle>Unlimited Plunges</CardTitle>
        </div>
        <CardDescription className="text-sm">
          Unlimited cold plunge sessions each month.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {sweat440MemberOption ? (
          <div className="space-y-1">
            <div className="flex gap-4 items-center">
              <div className="w-fit relative flex justify-center items-center">
                <p className="text-3xl text-zinc-400">$99</p>
                <div className="border border-red-900 w-full -rotate-[20deg] absolute" />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-3xl">$49</p>
                <div className="h-8 border-[0.5px] border-zinc-600" />
                <p className="text-xs text-zinc-600">
                  {/* Founding Member <br /> */}
                  New Year Special <br />
                  {/* {!!foundingMemberRedemptions
                    ? `${19 - foundingMemberRedemptions}/20 left`
                    : `19/20 left`} */}
                  {/* Only 20 spots! */}
                  (+ 2nd Month Free!)
                </p>
              </div>
            </div>
            {/* <p className="text-xs text-zinc-600 pl-[148px]">
              Code: <span className="font-semibold">FOUNDER10</span>
            </p> */}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex gap-4 ">
              <div className="w-fit relative flex justify-center items-center">
                <p className="text-3xl text-zinc-400">$149</p>
                <div className="border border-red-900 w-full -rotate-[20deg] absolute" />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-3xl">$69</p>
                <div className="h-8 border-[0.5px] border-zinc-600" />
                <p className="text-xs text-zinc-600">
                  New Year Special
                  <br />
                  Valid till Jan 31
                </p>
              </div>
            </div>
            {/* <p className="text-xs text-zinc-600 pl-[160px]">
              Code: <span className="font-semibold">NEWYEAR10</span>
            </p> */}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col w-full gap-2 items-end">
        <CheckoutBtn
          className="bg-cyan-700 hover:bg-cyan-700/90 w-full"
          sweat440MemberOption={sweat440MemberOption}
          isSweat440Member={isSweat440Member}
          checkoutAction={async () =>
            subscriptionCheckoutSession({ sweat440MemberOption })
          }
        >
          Get unlimited
        </CheckoutBtn>
        <p className="text-xs text-zinc-600">
          Auto-renews each month. Cancel any time.
        </p>
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
    <Card
      className={cn('w-full relative overflow-hidden bg-zinc-50', {
        'bg-red-100/70': memberPayFailed,
      })}
    >
      <CardHeader className="pt-5 pb-3">
        <div className="flex gap-2 items-center">
          <div className="relative flex items-center justify-center h-min w-min">
            <BsFillBox2HeartFill
              className={cn('h-5 w-5 fill-cyan-700', {
                'fill-red-800': memberPayFailed,
              })}
            />
            <div
              className={cn('h-2.5 w-2 bg-cyan-700 absolute translate-y-1', {
                'bg-red-800': memberPayFailed,
              })}
            />
            <FaInfinity
              className={cn('h-3 w-3 fill-cyan-100 absolute translate-y-0.5', {
                'fill-red-100': memberPayFailed,
              })}
            />
          </div>
          <CardTitle>Unlimited Member</CardTitle>
        </div>
        <CardDescription className="text-sm">
          {memberPayFailed
            ? `The last subscription payment failed. Please review your billing details.`
            : `You've got unlimited access! Check your member details below.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2"></CardContent>
      <CardFooter className="pb-5">
        <div className="flex flex-col w-full gap-3">
          {memberPeriodEnd && !memberPayFailed ? (
            <p className="flex gap-1 w-full justify-end items-center text-sm">
              <span className="font-semibold">
                {memberRenewing ? `Renews on ` : `Canceled. Expires on `}
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
            </p>
          ) : null}
          <div className="flex flex-col w-full">
            <CheckoutBtn
              className={cn('bg-cyan-700 hover:bg-cyan-700/90', {
                'bg-red-800 hover:bg-red-800/90': memberPayFailed,
              })}
              checkoutAction={async () =>
                await billingPortalSession({ stripeCustomerId })
              }
            >
              {memberRenewing ? `Manage billing` : `Reactivate membership`}
            </CheckoutBtn>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
