'use client';

import { RiWaterFlashFill } from 'react-icons/ri';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StartPlungeBtn from './buttons/start-plunge-btn';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
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
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

export default function StartPlungeSection({
  isOnboarded,
  freeCredits,
  isMember,
}: {
  isOnboarded: boolean;
  freeCredits?: Profile['freeCredits'];
  isMember: Profile['isMember'];
}) {
  const { numberOfSessions: plungeSessionsNum } = usePlungeSessions();

  if (!isOnboarded) {
    return null;
  }

  if (!isMember || freeCredits) {
    return (
      <section className="space-y-4">
        <H2 className="mb-3">Start plunge</H2>
        <Carousel className="w-full mx-auto relative z-10">
          <CarouselContent>
            <CarouselItem className="basis-5/6">
              <PlungeCard isSweat440Member={true} />
            </CarouselItem>
            <CarouselItem className="basis-5/6">
              <PlungeCard isSweat440Member={false} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <H2 className="mb-3">Start plunge</H2>
      <StartNewPlungeAlert freeCredits={freeCredits} isMember={isMember} />
    </section>
  );
}

function PlungeCard({ isSweat440Member }: { isSweat440Member: boolean }) {
  return (
    <Card className="w-full relative overflow-hidden bg-zinc-50">
      <CardHeader className="mt-3 pb-3">
        <div className="w-full bg-indigo-900 absolute top-0 left-0 px-6 py-1 text-zinc-100 uppercase text-sm">
          {isSweat440Member ? `Sweat440 Highland Members` : `Non-Members`}
        </div>
        <CardTitle>Single Plunge</CardTitle>
        <CardDescription className="text-sm leading-[18px]">
          1 cold plunge session up to 10 mins long
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-semibold">
          {isSweat440Member ? `US$20` : `US$25`}
        </p>

        {/* <div className="border-l-[1px] border-zinc-400 h-7" /> */}
      </CardContent>
      <CardFooter>
        <Button className="w-full text-sm">Start session</Button>
      </CardFooter>
    </Card>
  );
}

function StartNewPlungeAlert({
  freeCredits,
  isMember,
}: {
  freeCredits?: Profile['freeCredits'];
  isMember: Profile['isMember'];
}) {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>New plunge session</AlertTitle>
        <AlertDescription>
          {isMember || freeCredits
            ? `Feel amazing in just a few minutes`
            : `Get plunging for just $25 per session`}
        </AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start session</StartPlungeBtn>
        </div>
        {isMember ? (
          <AlertDescription className="font-semibold text-end">
            Unlimited access
          </AlertDescription>
        ) : freeCredits && freeCredits > 0 ? (
          <AlertDescription className="font-semibold text-end">
            {`Free credits:  ${freeCredits}`}
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}
