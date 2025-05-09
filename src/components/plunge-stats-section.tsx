'use client';

import { AiFillThunderbolt } from 'react-icons/ai';
import { BsStopwatchFill } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa6';

import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import H2 from './h2';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
} from './ui/card';

export default function PlungeStatsSection({
  isOnboarded
}: {
  isOnboarded: boolean;
}) {
  const {
    numberOfSessions: plungeSessionsNum,
    avgPlungeSecs,
    currentStreakDays,
  } = usePlungeSessions();

  if (!isOnboarded) {
    return null;
  }

  if (plungeSessionsNum === 0) {
    return null;
  }

  return (
    <section>
      <H2 className="mb-3">Plunge Stats</H2>
      <Card className="pt-5">
        <CardContent className="flex w-full justify-between">
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
            stat={avgPlungeSecs}
            statLabel="Avg time"
            statIcon={<BsStopwatchFill className="w-9 h-9 fill-green-koldup" />}
          />
        </CardContent>
      </Card>
    </section>
  );
}

function StatCard({
  stat,
  statLabel,
  statIcon,
}: {
  stat: number;
  statLabel: 'Streak days' | 'Total plunges' | 'Plunge time' | 'Avg time';
  statIcon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 w-fit items-center">
      <span
        className={cn('text-4xl font-semibold', {
          'mx-3': statLabel === 'Plunge time',
        })}
      >
        {statLabel === 'Avg time' ? <PlungeTimeStat stat={stat} /> : stat}
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
