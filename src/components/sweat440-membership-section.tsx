'use client';

import { Profile } from '@prisma/client';
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
import Sweat440Logo from './logos/sweat440-logo';

export default function Sweat440MembershipsSection({
  isOnboarded,
  isSweat440Member,
}: {
  isOnboarded: boolean;
  isSweat440Member: boolean;
}) {
  if (!isOnboarded || isSweat440Member) {
    return null;
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">SWEAT440 Membership</H2>
      <ConfirmMembershipCard />
    </section>
  );
}

function ConfirmMembershipCard() {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className="mt-10 pb-3">
        <div className="w-full  absolute top-0 left-0 px-6 py-1 text-zinc-100 uppercase text-sm">
        <Sweat440Logo className="w-36" />
        </div>
        
        <CardTitle>Confirm Membership</CardTitle>
        <CardDescription className="text-sm">
          SWEAT440 Austin Highland members get access to exclusive member
          prices and offers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 pb-4">
        {/* <p className="text-3xl font-semibold">
          Free
        </p> */}
      </CardContent>
      <CardFooter>
        <Button className="bg-[#00aded] hover:bg-[#00aded]/90 w-full">
          Confirm Membership
        </Button>
      </CardFooter>
    </Card>
  );
}
