'use client';

import { BsFillBox2HeartFill } from 'react-icons/bs';
import { MdBlock } from 'react-icons/md';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import BuyPackBtn from './buy-pack-btn';
import H2 from './h2';
import StartPlungeBtn from './start-plunge-btn';
import { cn } from '@/lib/utils';
import { User } from '@prisma/client';

export default function PlungePlansSection({
  isOnboarded,
}: {
  isOnboarded: boolean;
}) {
  if (!isOnboarded) return null;

  return (
    <section>
      <H2 className="mb-3">Plans</H2>
      <PlungePackAlert />
    </section>
  );
}

function PlungePackAlert() {
  return (
    <Alert className="bg-orange-100 text-zinc-700 pr-10 pt-5 flex gap-2">
      <BsFillBox2HeartFill className="h-5 w-5 fill-orange-800" />
      <div className="space-y-3 w-full">
        <AlertTitle>Plunge 8-Pack</AlertTitle>
        <AlertDescription>{`Get 8 plunges and save $3.50 per plunge`}</AlertDescription>
        <div className="flex flex-col w-full">
          <BuyPackBtn className="bg-orange-800 hover:bg-orange-800/90">
            Get pack
          </BuyPackBtn>
        </div>
      </div>
    </Alert>
  );
}
