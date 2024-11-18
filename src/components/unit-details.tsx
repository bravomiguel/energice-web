'use client';

import { useMemo, useState, useTransition } from 'react';
import { BsThermometerSnow } from 'react-icons/bs';
import { GoGoal } from 'react-icons/go';
import { GoChecklist } from 'react-icons/go';
import { IoWarningOutline } from 'react-icons/io5';
import { PiWarningCircle } from 'react-icons/pi';
import { RiLightbulbFlashLine } from 'react-icons/ri';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

import { Button } from './ui/button';
import BottomNav from './bottom-nav';
import PenaltyChargeWarning from './penalty-charge-warning';
import {
  applyFreeCredit,
  applyPaidCredit,
  createSession,
  applyUnlimited,
} from '@/lib/actions/session-actions';
import { plungeCheckoutSession } from '@/lib/actions/payment-actions';
import { plungeTimerSecsSchema } from '@/lib/validations';
import { cn } from '@/lib/utils';
import PlungeTimerInfo from './plunge-timer-info';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { HOW_IT_WORKS_ARRAY } from '@/lib/constants';
import PlungeTipsCarousel from './plunge-tips-carousel';
import { DurationDropdown } from './duration-dropdown';

export default function UnitDetails({
  unitStatus,
  unitId,
  paidCredits,
  hasFreeCredit,
  isMember,
}: {
  unitStatus: string;
  unitId: string;
  paidCredits: number;
  hasFreeCredit: boolean;
  isMember: boolean;
}) {
  const [plungeTimerVals, setPlungeTimerVals] = useState({
    mins: '01',
    secs: '30',
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const isValid = validationError === null;

  const plungeTimerSecs = useMemo(() => {
    // validation check
    const validatedData = plungeTimerSecsSchema.safeParse(
      `${plungeTimerVals.mins}:${plungeTimerVals.secs}`,
    );
    if (!validatedData.success) {
      const errorMessage = validatedData.error.issues[0].message;
      setValidationError(errorMessage ? errorMessage : 'Invalid timer input');
      return null;
    }

    setValidationError(null);

    return validatedData.data;
  }, [plungeTimerVals]);

  const warningMessage =
    plungeTimerSecs && plungeTimerSecs === 360
      ? '6 mins is the max time limit'
      : plungeTimerSecs && plungeTimerSecs > 240
      ? '>4 mins is for advanced plungers'
      : plungeTimerSecs && plungeTimerSecs > 120 && plungeTimerSecs < 240
      ? 'Beginners advised to do <2 mins'
      : null;

  const [isPending, startTransition] = useTransition();

  const handleStartSession = async () => {
    startTransition(async () => {
      if (!plungeTimerSecs) return;
      const respSession = await createSession({
        unitId,
        plungeTimerSecs,
      });
      if (respSession?.error) {
        console.error({ error: respSession.error });
        toast.error(respSession.error);
      }

      let sessionId;
      if (respSession?.data) {
        sessionId = respSession.data.newSessionId;
      }

      if (sessionId) {
        if (isMember) {
          // if unlimited member, apply it in db then redirect to session unlock screen
          const respApplyUnlimited = await applyUnlimited({
            sessionId,
          });
          if (respApplyUnlimited?.error) {
            console.error({ error: respApplyUnlimited.error });
            toast.error(respApplyUnlimited.error);
          }
        } else if (paidCredits > 0) {
          // if paid credit available, apply it in the back-end, and redirect to unlock screen
          const respApplyCredit = await applyPaidCredit({
            sessionId,
          });
          if (respApplyCredit?.error) {
            console.error({ error: respApplyCredit.error });
            toast.error(respApplyCredit.error);
          }
        } else if (hasFreeCredit) {
          // if free credit available, apply it in the back-end, and redirect to unlock screen
          const respApplyCredit = await applyFreeCredit({
            sessionId,
          });
          if (respApplyCredit?.error) {
            console.error({ error: respApplyCredit.error });
            toast.error(respApplyCredit.error);
          }
        } else {
          // if no free credit, redirect to stripe checkout page for payment
          const respCheckout = await plungeCheckoutSession({
            unitId,
            sessionId,
          });
          if (respCheckout?.error) {
            console.error({ error: respCheckout.error });
            toast.error(respCheckout.error);
          }
        }
      } else {
        // if no session id, return error
        toast.error('No session created, please try again.');
      }
    });
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="flex gap-3 items-start justify-between py-4 border-b">
          <GoGoal className="h-7 w-7 mr-1 text-zinc-500" />

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <p>Set your plunge timer</p>

              <div className="flex-1 flex gap-0.5 mb-auto items-center justify-end">
                <DurationDropdown
                  type="mins"
                  value={plungeTimerVals}
                  setValue={setPlungeTimerVals}
                  className="bg-zinc-200 font-semibold h-8"
                />
                <span className="font-medium self-end ">m</span>
                <span className="font-bold">:</span>
                <DurationDropdown
                  type="secs"
                  value={plungeTimerVals}
                  setValue={setPlungeTimerVals}
                  className="bg-zinc-200 font-semibold h-8"
                />
                <span className="font-medium self-end ">s</span>
              </div>

              <PlungeTimerInfo />
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
        </div>

        <div className="flex gap-3 items-center py-4 border-b">
          <BsThermometerSnow className="ml-1 h-7 w-7 text-zinc-500" />
          <p className="">43F-47F water temp</p>
        </div>

        <div className="flex flex-col gap-3 py-4 border-b">
          <div className="flex gap-3 items-center">
            <GoChecklist className="ml-1 h-7 w-7 text-zinc-500 self-start" />
            <p className="">How it works</p>
          </div>
          <HowItWorksCarousel />
        </div>

        <div className="flex flex-col gap-3 py-4 border-b">
          <div className="flex gap-3 items-center">
            <RiLightbulbFlashLine className="ml-1 h-7 w-7 text-zinc-500 self-start" />
            <p className="">Plunge Tips</p>
          </div>
          <PlungeTipsCarousel />
        </div>
      </div>
      <BottomNav className="gap-1 pt-2 pb-3">
        <div className="flex flex-row w-full gap-4 items-center">
          {isMember ? (
            <span className="text-lg font-bold w-fit text-center whitespace-nowrap">
              Unlimited
            </span>
          ) : paidCredits > 0 || hasFreeCredit ? (
            <span className="text-lg font-bold w-fit text-center whitespace-nowrap">
              {paidCredits > 0
                ? `${paidCredits} credit${paidCredits > 1 ? 's' : ''}`
                : 'free credit'}
            </span>
          ) : (
            <span className="text-4xl font-bold">$9</span>
          )}
          <Button
            disabled={unitStatus !== 'Ready' || !isValid || isPending}
            isLoading={isPending}
            className="w-full"
            onClick={async () => {
              startTransition(async () => await handleStartSession());
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
          <CarouselItem key={index} className="space-y-5 relative text-sm">
            <div className="flex w-9/12 mx-auto gap-2">
              <span className="w-5 h-5 bg-gray-200 rounded-full text-xs flex items-center justify-center text-gray-700 font-extrabold p-2 translate-y-0.5">
                {index + 1}
              </span>
              <p className="text-zinc-600 text-left">
                {HOW_IT_WORKS_ARRAY[index].message}
              </p>
            </div>
            <div className="flex justify-center items-center w-9/12 aspect-square mx-auto overflow-hidden rounded-lg bg-zinc-200">
              <ReactPlayer
                url={HOW_IT_WORKS_ARRAY[index].url}
                playing
                playsinline
                controls
                loop
                muted
                width={'100%'}
                height={'100%'}
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
