'use client';

import { RiWaterFlashFill } from 'react-icons/ri';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StartPlungeBtn from './buttons/start-plunge-btn';
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
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { Infinity, Tickets } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StartPlungeSection({
  isOnboarded,
  freeCredits,
  isMember,
  isSweat440Member,
}: {
  isOnboarded: boolean;
  freeCredits: Profile['freeCredits'];
  isMember: Profile['isMember'];
  isSweat440Member: Profile['isSweat440Member'];
}) {
  if (!isOnboarded) {
    return null;
  }

  if (isMember || freeCredits > 0) {
    return (
      <section className="space-y-4">
        <H2 className="mb-3">Start plunge</H2>
        <StartNewPlungeAlert freeCredits={freeCredits} isMember={isMember} />
      </section>
    );
  }

  if (isSweat440Member) {
    return (
      <section className="space-y-4">
        <H2 className="mb-3">Start plunge</H2>
        <PlungeCard
          isSweat440Member={isSweat440Member}
          sweat440MemberOption={true}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Start plunge</H2>
      <Carousel className="w-full mx-auto relative z-10">
        <CarouselContent>
          <CarouselItem className="basis-5/6">
            <PlungeCard sweat440MemberOption={true} />
          </CarouselItem>
          <CarouselItem className="basis-5/6">
            <PlungeCard sweat440MemberOption={false} />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function PlungeCard({
  isSweat440Member,
  sweat440MemberOption,
}: {
  isSweat440Member?: boolean;
  sweat440MemberOption: boolean;
}) {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className='mt-3 pb-3'>

          <div className="w-full bg-indigo-900 absolute top-0 left-0 px-6 py-1 text-zinc-100 uppercase text-xs">
            {sweat440MemberOption ? `Sweat440 Highland Members` : `Non-Members`}
          </div>
       
        <div className="flex gap-2 items-center">
          {isSweat440Member && (
            <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
          )}
          <CardTitle>Single Plunge</CardTitle>
        </div>
        <CardDescription className="text-sm">
          1 cold plunge session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <p className="text-3xl font-semibold">
          {sweat440MemberOption ? `US$20` : `US$25`}
        </p>

        {/* <div className="border-l-[1px] border-zinc-400 h-7" /> */}
      </CardContent>
      <CardFooter>
        <StartPlungeBtn className="w-full">Start session</StartPlungeBtn>
      </CardFooter>
    </Card>
  );
}

function StartNewPlungeAlert({
  freeCredits,
  isMember,
}: {
  freeCredits: Profile['freeCredits'];
  isMember: Profile['isMember'];
}) {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>Plunge Session</AlertTitle>
        <AlertDescription>Feel amazing in just a few minutes.</AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start session</StartPlungeBtn>
        </div>
        {isMember ? (
          <AlertDescription className="font-semibold text-end">
            <div className="flex gap-2 items-center justify-end">
              <p>Unlimited access</p>
              <Infinity className="h-5 w-5" />
            </div>
          </AlertDescription>
        ) : freeCredits > 0 ? (
          <AlertDescription className="font-semibold text-end">
            <div className="flex gap-2 items-center justify-end">
              <p>
                {freeCredits === 1
                  ? `1 free credit`
                  : `${freeCredits} free credits`}
              </p>
              <Tickets className="h-5 w-5" />
            </div>
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}
