'use client';
import { RiWaterFlashFill } from 'react-icons/ri';
import { AiFillThunderbolt } from 'react-icons/ai';
import { BsStopwatchFill } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa6';
import { IoArrowUndoSharp } from 'react-icons/io5';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import StartPlungeBtn from './start-plunge-btn';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import H2 from './h2';
import OnboardReturnBtn from './onboard-return-btn';

export default function PlungeStats({ isOnboarded }: { isOnboarded: boolean }) {
  const {
    numberOfSessions: plungeSessionsNum,
    overallPlungeSecs,
    currentStreakDays,
  } = usePlungeSessions();

  const overallPlungeMins = Math.ceil(overallPlungeSecs / 60);

  if (!isOnboarded) {
    return <CompleteOnboardingAlert />;
  }

  if (plungeSessionsNum === 0) {
    return <StartFirstPlungeAlert />;
  }

  return (
    <>
      <H2>Your plunge stats</H2>
      <div className="flex w-full gap-2">
        <StatCard
          stat={currentStreakDays}
          statLabel="Streak days"
          statIcon={
            <AiFillThunderbolt className="w-10 h-10 fill-green-koldup" />
          }
        />
        <StatCard
          stat={overallPlungeMins}
          statLabel="Plunge mins"
          statIcon={<BsStopwatchFill className="w-9 h-9 fill-green-koldup" />}
        />
        <StatCard
          stat={plungeSessionsNum}
          statLabel="Total plunges"
          statIcon={<FaPlay className="w-9 h-9 fill-green-koldup" />}
        />
      </div>
      <StartNewPlungeAlert />
      {/* <Buy10PackAlert /> */}
    </>
  );
}

function StatCard({
  stat,
  statLabel,
  statIcon,
}: {
  stat: number;
  statLabel: string;
  statIcon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 w-full items-center">
      <span className="text-4xl font-semibold">{stat}</span>
      <p className="text-sm font-medium">{statLabel}</p>
      {statIcon}
    </div>
  );
}

function CompleteOnboardingAlert() {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <IoArrowUndoSharp className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>Complete onboarding</AlertTitle>
        <AlertDescription>
          {`You've just got a couple more steps left to start plunging`}
        </AlertDescription>
        <div className="flex flex-col w-full">
          <OnboardReturnBtn>Return to onboarding</OnboardReturnBtn>
        </div>
      </div>
    </Alert>
  );
}

function StartFirstPlungeAlert() {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>Start your first plunge</AlertTitle>
        <AlertDescription>
          {`Get ready for the ultimate workout recovery!`}
        </AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start first plunge</StartPlungeBtn>
        </div>
      </div>
    </Alert>
  );
}

function StartNewPlungeAlert() {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>Start new plunge session</AlertTitle>
        {/* <AlertDescription>
          {`Let's get you doing your first plunge, and feeling sky high!`}
        </AlertDescription> */}
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start session</StartPlungeBtn>
        </div>
      </div>
    </Alert>
  );
}

function Buy10PackAlert() {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>Plunge 10-Pack</AlertTitle>
        <AlertDescription>{`Buy 10 plunges and save 30%`}</AlertDescription>
        <div className="flex flex-col w-full">
          <Button>Get deal</Button>
        </div>
      </div>
    </Alert>
  );
}
