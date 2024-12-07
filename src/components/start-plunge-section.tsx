'use client';

import { RiWaterFlashFill } from 'react-icons/ri';

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
  isSweat440Member: boolean;
}) {
  if (!isOnboarded) {
    return null;
  }

  if (isMember || freeCredits > 0) {
    return (
      <section className="space-y-4">
        <H2 className="mb-3">Start Plunge</H2>
        <StartNewPlungeCard freeCredits={freeCredits} isMember={isMember} />
      </section>
    );
  }

  if (isSweat440Member) {
    return (
      <section className="space-y-4">
        <H2 className="mb-3">Start Plunge</H2>
        <PlungeCard
          isSweat440Member={isSweat440Member}
          sweat440MemberOption={true}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Start Plunge</H2>
      <Carousel className="w-full mx-auto relative z-10">
        <CarouselContent>
          <CarouselItem className="basis-[87%]">
            <PlungeCard
              sweat440MemberOption={true}
              isSweat440Member={isSweat440Member}
            />
          </CarouselItem>
          <CarouselItem className="basis-[87%]">
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
      <CardHeader className="mt-3 pb-3">
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
        <p className="text-3xl font-medium">
          {sweat440MemberOption ? `$20` : `$25`}
        </p>

        {/* <div className="border-l-[1px] border-zinc-400 h-7" /> */}
      </CardContent>
      <CardFooter>
        <StartPlungeBtn
          className="w-full"
          isSweat440Member={isSweat440Member}
          sweat440MemberOption={sweat440MemberOption}
        >
          Start session
        </StartPlungeBtn>
      </CardFooter>
    </Card>
  );
}

function StartNewPlungeCard({
  freeCredits,
  isMember,
}: {
  freeCredits: Profile['freeCredits'];
  isMember: Profile['isMember'];
}) {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className="pt-5 pb-3">
        <div className="flex gap-2 items-center">
          <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
          <CardTitle>Plunge Session</CardTitle>
        </div>
        <CardDescription className="text-sm">
          Feel amazing in just a few minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2"></CardContent>
      <CardFooter className="pb-5">
        <div className="flex flex-col w-full gap-3">
          <StartPlungeBtn className="w-full">Start session</StartPlungeBtn>
          <div
            className={cn(
              'font-semibold text-sm flex items-center justify-between w-full',
              { 'justify-end': freeCredits > 0 && !isMember },
            )}
          >
            {isMember && (
              <div className="flex gap-2 items-center">
                <p>Unlimited</p>
                <Infinity className="h-5 w-5" />
              </div>
            )}
            {freeCredits > 0 && (
              <div className="flex gap-2 items-center">
                <p>
                  {freeCredits === 1
                    ? `1 free credit`
                    : `${freeCredits} free credits`}
                </p>
                <Tickets className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
