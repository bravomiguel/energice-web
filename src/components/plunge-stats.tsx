'use client';

import { RiWaterFlashFill } from 'react-icons/ri';
import { AiFillThunderbolt } from 'react-icons/ai';
import { BsStopwatchFill } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa6';
import { IoArrowUndoSharp } from 'react-icons/io5';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StartPlungeBtn from './start-plunge-btn';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import H2 from './h2';
import OnboardReturnBtn from './onboard-return-btn';
import { cn } from '@/lib/utils';
import { User } from '@prisma/client';
import { toast } from 'sonner';

export default function PlungeStats({
  isOnboarded,
  paidCredits,
}: {
  isOnboarded: boolean;
  paidCredits?: User['paidCredits'];
  paymentSuccess?: boolean | boolean[];
}) {
  const {
    numberOfSessions: plungeSessionsNum,
    overallPlungeSecs,
    currentStreakDays,
  } = usePlungeSessions();

  if (!isOnboarded) {
    return <CompleteOnboardingAlert />;
  }

  if (plungeSessionsNum === 0) {
    return <StartFirstPlungeAlert paidCredits={paidCredits} />;
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
          stat={plungeSessionsNum}
          statLabel="Total plunges"
          statIcon={<FaPlay className="w-9 h-9 fill-green-koldup" />}
        />
        <StatCard
          stat={overallPlungeSecs}
          statLabel="Plunge time"
          statIcon={<BsStopwatchFill className="w-9 h-9 fill-green-koldup" />}
        />
      </div>
      <StartNewPlungeAlert paidCredits={paidCredits} />
    </>
  );
}

function StatCard({
  stat,
  statLabel,
  statIcon,
}: {
  stat: number;
  statLabel: 'Streak days' | 'Total plunges' | 'Plunge time';
  statIcon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 w-full items-center">
      <span
        className={cn('text-4xl font-semibold', {
          'mx-3': statLabel === 'Plunge time',
        })}
      >
        {statLabel === 'Plunge time' ? <PlungeTimeStat stat={stat} /> : stat}
      </span>
      <p className="text-sm font-medium">{statLabel}</p>
      {statIcon}
    </div>
  );
}

function PlungeTimeStat({ stat }: { stat: number }) {
  const minutes = Math.floor(stat / 60);
  const remainingSeconds = stat % 60;
  const hours = Math.floor(stat / (60 * 60));
  const remainingMinutes = Math.floor((stat % (60 * 60)) / 60);
  if (minutes === 0) {
    return (
      <>
        {remainingSeconds}
        <span className="text-sm font-normal">s</span>
      </>
    );
  } else if (minutes >= 100) {
    return (
      <div className="flex items-end">
        {hours}
        <span className="text-sm font-normal leading-none -translate-y-[4.5px] pr-1">
          h
        </span>
        {remainingMinutes}
        <span className="text-sm font-normal leading-none -translate-y-[4.5px]">
          m
        </span>
      </div>
    );
  } else if (remainingSeconds === 0) {
    return (
      <>
        {minutes}
        <span className="text-sm font-normal">m</span>
      </>
    );
  } else {
    return (
      <div className="flex items-end">
        {minutes}
        <span className="text-sm font-normal leading-none -translate-y-[4.5px] pr-1">
          m
        </span>
        {remainingSeconds}
        <span className="text-sm font-normal leading-none -translate-y-[4.5px]">
          s
        </span>
      </div>
    );
  }
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

function StartFirstPlungeAlert({
  paidCredits,
}: {
  paidCredits?: User['paidCredits'];
}) {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>No plunges yet</AlertTitle>
        <AlertDescription>{`Time to take your first plunge!`}</AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start first plunge</StartPlungeBtn>
        </div>
        {paidCredits && paidCredits > 0 ? (
          <AlertDescription>
            Plunge credits: <span className="font-semibold">{paidCredits}</span>
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}

function StartNewPlungeAlert({
  paidCredits,
}: {
  paidCredits?: User['paidCredits'];
}) {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>Start new plunge session</AlertTitle>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start session</StartPlungeBtn>
        </div>
        {paidCredits && paidCredits > 0 ? (
          <AlertDescription>
            Plunge credits: <span className="font-semibold">{paidCredits}</span>
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}
