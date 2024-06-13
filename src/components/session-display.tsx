'use client';

import { Session } from '@prisma/client';

import { cn, formatSecsToMins } from '@/lib/utils';
import { IoIosArrowBack, IoIosTimer } from 'react-icons/io';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { IoWarningOutline } from 'react-icons/io5';
import { IoIosThumbsUp } from 'react-icons/io';
import { FaCheckCircle } from 'react-icons/fa';
import { IoThumbsUpSharp } from 'react-icons/io5';
import Subtitle from './subtitle';
import BottomNav from './bottom-nav';
import { Button } from './ui/button';
import H1 from './h1';

export default function SessionDisplay({
  // sessionData,
  className,
}: {
  // sessionData: Session;
  className?: string;
}) {
  return (
    <>
      <H1>Session</H1>
      <div className={cn(className)}>
        <CountdownCircleTimer
          isPlaying={false}
          duration={120}
          colors={['#4338ca', '#4338ca']}
          colorsTime={[120, 0]}
          rotation="counterclockwise"
          trailColor="#e5e7eb"
          size={300}
          isSmoothColorTransition={false}

          // onUpdate={(remainingTime) =>
          //   setPlungeSecsCountdown(remainingTime)
          // }
        >
          {({ remainingTime }) => (
            <div className="flex flex-col items-center gap-2">
              <p className="text-zinc-500">Plunge timer</p>
              <span className="text-7xl font-semibold">
                {/* {formatSecsToMins(remainingTime)} */}
                {formatSecsToMins(0)}
              </span>
              <div className="flex justify-center items-center gap-1">
                <IoIosTimer className="text-gray-500 h-5 w-5" />
                <p className="text-gray-500 w-12 text-start">
                  {formatSecsToMins(154)}
                </p>
              </div>
            </div>
          )}
        </CountdownCircleTimer>
        <div className="ml-12 self-start flex flex-col border-[0.5px] rounded-lg py-2 px-4 shadow">
          <Subtitle className="text-zinc-600 font-normal">
            Session time left
          </Subtitle>
          <p
            // className={`text-2xl ${
            //   sessionSecs > 300
            //     ? 'text-green-600'
            //     : sessionSecs > 120
            //     ? 'text-amber-500'
            //     : 'text-red-500'
            // }`}
            className="text-2xl"
          >
            {/* {formatTime(sessionSecs)} */}
            {formatSecsToMins(600)}
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center gap-4">
        <IoWarningOutline className="h-16 w-16 text-red-600" />
        <Subtitle className="text-2xl text-red-600">
          Close the lid in <span>{formatSecsToMins(30)}</span>
        </Subtitle>
        <Subtitle className="text-zinc-800">
          To avoid an extra <span>$10</span> charge
        </Subtitle>
      </div>
      <BottomNav className="space-y-3">
        <Button variant="default" className="w-full h-16">
          Start timer
        </Button>
        <Button variant="destructive" className="w-full h-16">
          End session
        </Button>
      </BottomNav>
    </>
  );
}
