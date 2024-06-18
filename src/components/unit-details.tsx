'use client';

import { useState, useTransition } from 'react';
import { BsThermometerSnow } from 'react-icons/bs';
import { GoGoal } from 'react-icons/go';
import { GoChecklist } from 'react-icons/go';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { IoWarningOutline } from 'react-icons/io5';
import { PiWarningCircle } from 'react-icons/pi';

import { Button } from './ui/button';
import BottomNav from './bottom-nav';
import PenaltyChargeWarning from './penalty-charge-warning';
import { createSession } from '@/actions/actions';
import { plungeTimerSecsSchema } from '@/lib/validations';
import { formatSecsToMins } from '@/lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';

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
    plungeTimerSecs >= 300
      ? '>5 mins is for advanced practitioners'
      : plungeTimerSecs > 120 && plungeTimerSecs < 300
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
                className="rounded-lg bg-zinc-200 font-semibold focus-visible:font-semibold text-lg pl-2 w-28 h-8"
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

          <Button
            size="sm"
            className="p-2 ml-auto bg-indigo-600 hover:bg-indigo-600/90"
          >
            <IoMdInformationCircleOutline className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-3 items-center py-4 border-b">
          <BsThermometerSnow className="ml-1 h-7 w-7 text-zinc-500" />

          <p>42F-46F water temp</p>
        </div>

        <div className="flex flex-col gap-3 py-4 border-b">
          <div className="flex gap-3 items-center">
            <GoChecklist className="ml-1 h-7 w-7 text-zinc-500 self-start" />

            <p>How it works</p>
          </div>

          <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
            {`GIF "How it works" Explanation`}
          </div>
        </div>
      </div>
      <BottomNav>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <p className="text-4xl font-bold">$10</p>
          </div>
          <Button
            disabled={unitStatus !== 'Ready' || !isValid || isPending}
            className="flex-1"
            onClick={async () => {
              startTransition(async () => {
                const response = await createSession({
                  unitId,
                  plungeTimerSecs,
                  assignCode: true,
                });
                if (response?.error) {
                  console.error({ error: response.error });
                }
              });
            }}
          >
            Start Plunge
          </Button>
        </div>
        <PenaltyChargeWarning />
      </BottomNav>
    </>
  );
}
