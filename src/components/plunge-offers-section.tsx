'use client';

import H2 from './h2';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { BsFillBox2HeartFill } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-utils';
import { toast } from 'sonner';
import { extraCreditAction } from '@/lib/actions/profile-actions';

export default function PlungeOffersSection({
  isOnboarded,
  hasS440MemberCredit,
  isSweat440Member,
}: {
  isOnboarded: boolean;
  hasS440MemberCredit: boolean;
  isSweat440Member: boolean;
}) {
  if (!isOnboarded || hasS440MemberCredit) {
    return null;
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Offers</H2>
      <ExtraCreditCard isSweat440Member={isSweat440Member} />
    </section>
  );
}

function ExtraCreditCard({ isSweat440Member }: { isSweat440Member: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleExtraCredit = async () => {
    startTransition(async () => {
      if (isSweat440Member) {
        const response = await extraCreditAction();
        if (response?.error) {
          console.error({ error: response.error });
          toast.error(response.error);
          return;
        }
        toast.success('Extra credit added');
        return;
      }
      router.push(
        `/partner-membership/${process.env.NEXT_PUBLIC_SWEAT440_HIGHLAND_ID}?extraCredit=true`,
      );
    });
  };

  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className="mt-3 pb-3">
        <div className="w-full bg-indigo-900 absolute top-0 left-0 px-6 py-1 text-zinc-100 uppercase text-xs">
          Sweat440 Highland Members
        </div>
        <div className="flex gap-2 items-center">
          <BsFillBox2HeartFill className="h-5 w-5 fill-indigo-700" />
          <CardTitle>Free Credit</CardTitle>
        </div>
        <CardDescription className="text-sm">
          1 extra free plunge credit for SWEAT440 Highland members.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 pb-4">
        {/* <p className="text-3xl font-semibold">
          Free
        </p> */}
      </CardContent>
      <CardFooter>
        <Button
          className="bg-indigo-800 hover:bg-indigo-800/90 w-full"
          onClick={async () => await handleExtraCredit()}
          disabled={isPending}
          isLoading={isPending}
        >
          Claim credit
        </Button>
      </CardFooter>
    </Card>
  );
}
