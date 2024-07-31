'use client';

import { BsFillBox2HeartFill } from 'react-icons/bs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import BuyPackBtn from './buy-pack-btn';

export default function PlungePackAlert({ isOnboarded }: { isOnboarded: boolean }) {
  if (!isOnboarded) return null;

  return (
    <Alert className="bg-orange-100 text-zinc-700 pr-10 pt-5">
      <BsFillBox2HeartFill className="h-5 w-5 fill-orange-800" />
      <div className="space-y-3">
        <AlertTitle>Plunge 8-Pack</AlertTitle>
        <AlertDescription>{`Get 8 plunges and save $3.50 per plunge!`}</AlertDescription>
        <div className="flex flex-col w-full">
          <BuyPackBtn className="bg-orange-800 hover:bg-orange-800/90">
            Get pack
          </BuyPackBtn>
        </div>
      </div>
    </Alert>
  );
}