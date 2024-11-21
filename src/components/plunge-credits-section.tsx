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

export default function PlungeOffersSection({
  isOnboarded,
}: {
  isOnboarded: boolean;
}) {
  if (!isOnboarded) return null;

  return (
    <section>
      <H2 className="mb-3">Offers</H2>
      <div className="space-y-3">
        {/* <PlungeOption /> */}
        {/* <PackOption /> */}
        <Sweat440MemberOption />
      </div>
    </section>
  );
}

function Sweat440MemberOption() {
  return (
    <Alert className="bg-sky-100 text-zinc-700 pr-10 pt-5 flex gap-2">
      <div className="relative flex items-center justify-center h-min w-min">
        <BsFillBox2HeartFill className="h-5 w-5 fill-sky-700" />
      </div>
      <div className="space-y-3 w-full">
        <AlertTitle>Extra Free Credit</AlertTitle>
        <AlertDescription>{`Are you a Sweat440 Member? Enjoy an extra free credit on us!`}</AlertDescription>
        <div className="flex flex-col w-full">
          <CheckoutBtn
            className="bg-sky-700 hover:bg-sky-700/90"
            checkoutAction={subscriptionCheckoutSession}
          >
            Confirm Sweat440 Membership
          </CheckoutBtn>
        </div>
      </div>
    </Alert>
  );
}