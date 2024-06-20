'use client';
import { RiWaterFlashFill, RiWaterFlashLine } from 'react-icons/ri';
import { AiFillThunderbolt } from 'react-icons/ai';
import { BsStopwatchFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import StartPlungeBtn from './start-plunge-btn';

export default function PlungeStats() {
  return (
    <>
      <StartFirstPlungeAlert />
      <div className="flex w-full gap-2">
        <StatCard
          stat={4}
          statLabel="Streak days"
          statIcon={<AiFillThunderbolt className="w-10 h-10 fill-green-koldup" />}
        />
        <StatCard
          stat={4}
          statLabel="Plunge minutes"
          statIcon={<BsStopwatchFill className="w-9 h-9 fill-green-koldup" />}
        />
        <StatCard
          stat={4}
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

function StartFirstPlungeAlert() {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>No plunges yet</AlertTitle>
        <AlertDescription>
          {`Let's get you doing your first plunge, and feeling sky high!`}
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
        <AlertTitle>Start new plunge!</AlertTitle>
        {/* <AlertDescription>
          {`Let's get you doing your first plunge, and feeling sky high!`}
        </AlertDescription> */}
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start plunge</StartPlungeBtn>
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
