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

export default function PlungePlansSection({
  isOnboarded,
  isMember,
  stripeCustomerId,
  memberPeriodEnd,
  memberPayFailed,
  memberRenewing,
}: {
  isOnboarded: boolean;
  isMember: boolean;
  stripeCustomerId: string;
  memberPeriodEnd?: Profile['memberPeriodEnd'];
  memberPayFailed?: Profile['memberPayFailed'];
  memberRenewing?: Profile['memberRenewing'];
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

  return (
    <section>
      <H2 className="mb-3">Memberships</H2>
      <div className="space-y-3">
        {/* <PlungeOption /> */}
        {/* <PackOption /> */}
        <SubscriptionOption />
      </div>
    </section>
  );
}

// function PackOption() {
//   return (
//     <Alert className="bg-sky-100 text-zinc-700 pr-10 pt-5 flex gap-2">
//       <BsFillBox2HeartFill className="h-5 w-5 fill-sky-700" />
//       <div className="space-y-3 w-full">
//         <AlertTitle>Plunge 5-Pack</AlertTitle>
//         <AlertDescription>{`5 plunge credits for $22.50 ($4.50 per session)`}</AlertDescription>
//         <div className="flex flex-col w-full">
//           <CheckoutBtn
//             className="bg-sky-700 hover:bg-sky-700/90"
//             checkoutAction={packCheckoutSession}
//           >
//             Get pack
//           </CheckoutBtn>
//         </div>
//       </div>
//     </Alert>
//   );
// }

function SubscriptionOption() {
  return (
    <Alert className="bg-sky-100 text-zinc-700 pr-10 pt-5 flex gap-2">
      <div className="relative flex items-center justify-center h-min w-min">
        <BsFillBox2HeartFill className="h-5 w-5 fill-sky-700" />
        <div className="h-2.5 w-2 bg-sky-700 absolute translate-y-1" />
        <FaInfinity className="h-3 w-3 fill-cyan-100 absolute translate-y-0.5" />
      </div>
      <div className="space-y-3 w-full">
        <AlertTitle>Unlimited plunges</AlertTitle>
        <AlertDescription>{`Get unlimited access for just $149 per month`}</AlertDescription>
        <div className="flex flex-col w-full">
          <CheckoutBtn
            className="bg-sky-700 hover:bg-sky-700/90"
            checkoutAction={subscriptionCheckoutSession}
          >
            Get unlimited
          </CheckoutBtn>
        </div>
      </div>
    </Alert>
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
      className={cn('bg-cyan-100 text-zinc-700 pr-10 pt-5 flex gap-2', {
        'bg-red-100 border-red-800': memberPayFailed,
      })}
    >
      <div className="relative flex items-center justify-center h-min w-min">
        <BsFillBox2HeartFill
          className={cn('h-5 w-5 fill-cyan-800', {
            'fill-red-800': memberPayFailed,
          })}
        />
        <div
          className={cn('h-2.5 w-2 bg-cyan-800 absolute translate-y-1', {
            'bg-red-800': memberPayFailed,
          })}
        />
        <FaInfinity
          className={cn('h-3 w-3 fill-cyan-100 absolute translate-y-0.5', {
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
            className={cn('bg-cyan-800 hover:bg-cyan-800/90', {
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
