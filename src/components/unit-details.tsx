'use client';

import { useState, useTransition } from 'react';
import { BsThermometerSnow } from 'react-icons/bs';
import { GoGoal } from 'react-icons/go';
import { GoChecklist } from 'react-icons/go';
import { IoWarningOutline } from 'react-icons/io5';
import { PiWarningCircle } from 'react-icons/pi';

import { Button } from './ui/button';
import BottomNav from './bottom-nav';
import PenaltyChargeWarning from './penalty-charge-warning';
import { createSession } from '@/actions/actions';
import { plungeTimerSecsSchema } from '@/lib/validations';
import { cn, formatSecsToMins } from '@/lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';
import PlungeTimerInfo from './plunge-timer-info';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import Image from 'next/image';
import {
  HOW_IT_WORKS_ARRAY,
  PLUNGE_TIME_INFO_ARRAY,
  PLUNGE_TIPS_ARRAY,
} from '@/lib/constants';
import PlungeTipsCarousel from './plunge-tips-carousel';

export default function UnitDetails({
  unitStatus,
  unitId,
}: {
  unitStatus: string;
  unitId: string;
}) {
  const [plungeTimerSecs, setPlungeTimerSecs] = useState(90);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isValid = validationError === null;
  const warningMessage =
    plungeTimerSecs > 240
      ? '>4 mins is for advanced plungers'
      : plungeTimerSecs > 120 && plungeTimerSecs < 240
      ? 'Beginners advised to do <2 mins'
      : null;
  const [isPending, startTransition] = useTransition();

  const handleTimerInput = (e: React.FormEvent<HTMLInputElement>) => {
    // validation check
    const validatedData = plungeTimerSecsSchema.safeParse(
      e.currentTarget.value,
    );
    if (!validatedData.success) {
      const errorMessage = validatedData.error.issues[0].message;
      setValidationError(errorMessage ? errorMessage : 'Invalid timer input');
      return;
    }

    const timerSecs = validatedData.data;

    setValidationError(null);
    setPlungeTimerSecs(timerSecs);
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex gap-3 items-start justify-between py-4 border-b">
          <GoGoal className="h-7 w-7 mr-1 text-zinc-500" />

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex gap-2">
              <Label
                className="self-center text-base font-normal"
                htmlFor="plungeTimer"
              >
                Set your plunge timer:
              </Label>

              <Input
                id="plungeTimer"
                type="time"
                defaultValue={formatSecsToMins(plungeTimerSecs)}
                // max={'08:00'}
                className="rounded-lg bg-zinc-200 font-semibold focus-visible:font-semibold text-lg pl-2 w-fit h-8"
                onChange={handleTimerInput}
              />
            </div>

            {validationError ? (
              <div className="text-red-500 flex justify-end items-center gap-1 text-sm">
                <PiWarningCircle className="h-5 w-5 self-start" />
                <p className="w-full">{validationError}</p>
              </div>
            ) : warningMessage ? (
              <div className="text-amber-500 flex justify-end items-center gap-1 text-sm">
                <IoWarningOutline className="h-5 w-5 self-start" />
                <p className="w-full">{warningMessage}</p>
              </div>
            ) : null}
          </div>

          <PlungeTimerInfo />
        </div>

        <div className="flex gap-3 items-center py-4 border-b">
          <BsThermometerSnow className="ml-1 h-7 w-7 text-zinc-500" />

          <p>43F-47F water temp</p>
        </div>

        <div className="flex flex-col gap-3 py-4 border-b">
          <div className="flex gap-3 items-center">
            <GoChecklist className="ml-1 h-7 w-7 text-zinc-500 self-start" />
            <p>How it works</p>
          </div>

          <HowItWorksCarousel />
        </div>

        <div className="flex flex-col gap-3 py-4 border-b">
          <div className="flex gap-3 items-center">
            <GoChecklist className="ml-1 h-7 w-7 text-zinc-500 self-start" />
            <p>Plunge Tips</p>
          </div>

          <PlungeTipsCarousel />
        </div>
      </div>
      <BottomNav className="gap-0 pt-3">
        <div className="flex flex-row w-full gap-4">
          <p className="text-4xl font-bold">$15</p>
          <Button
            disabled={unitStatus !== 'Ready' || !isValid || isPending}
            isLoading={isPending}
            className="w-full"
            onClick={async () => {
              startTransition(async () => {
                const response = await createSession({
                  unitId,
                  plungeTimerSecs,
                });
                if (response?.error) {
                  console.error({ error: response.error });
                }
              });
            }}
          >
            Start session
          </Button>
        </div>
        <PenaltyChargeWarning />
      </BottomNav>
    </>
  );
}

function HowItWorksCarousel() {
  return (
    <Carousel className="w-full mx-auto">
      <CarouselContent>
        {Array.from({ length: HOW_IT_WORKS_ARRAY.length }).map((_, index) => (
          <CarouselItem key={index} className="space-y-5 relative">
            <div className="flex w-9/12 mx-auto gap-2">
              <span className="w-5 h-5 bg-gray-200 rounded-full text-xs flex items-center justify-center text-gray-700 font-extrabold p-2 translate-y-0.5">
                {index + 1}
              </span>
              <p className="text-zinc-700 text-left">
                {HOW_IT_WORKS_ARRAY[index].message}
              </p>
            </div>
            <div className="flex justify-center items-center w-9/12 aspect-square mx-auto overflow-hidden rounded-lg bg-zinc-200">
              <Image
                src={HOW_IT_WORKS_ARRAY[index].gifUrl}
                alt="explainer gif"
                width={250}
                height={250}
              />
            </div>
            <div className="flex gap-2 items-center justify-center">
              {Array.from({ length: HOW_IT_WORKS_ARRAY.length }).map(
                (_, dotIndex) => (
                  <div
                    key={dotIndex}
                    className={cn(
                      'w-2 aspect-square rounded-full bg-zinc-300',
                      {
                        'bg-indigo-700': dotIndex === index,
                      },
                    )}
                  />
                ),
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="-translate-x-[170%]" />
      <CarouselPrevious className="translate-x-[170%]" />
    </Carousel>
  );
}