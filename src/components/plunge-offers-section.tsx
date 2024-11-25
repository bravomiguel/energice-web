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

export default function PlungeOffersSection({
  isOnboarded,
  hasSweat440MemberCredit,
}: {
  isOnboarded: boolean;
  hasSweat440MemberCredit: boolean;
}) {
  if (!isOnboarded || hasSweat440MemberCredit) {
    return null;
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Offers</H2>
      <ExtraCreditCard />
    </section>
  );
}

function ExtraCreditCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navToSweat400MemberScreen = async () => {
    startTransition(async () => {
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
          onClick={async () => await navToSweat400MemberScreen()}
          disabled={isPending}
          isLoading={isPending}
        >
          Claim credit
        </Button>
      </CardFooter>
    </Card>
  );
}
