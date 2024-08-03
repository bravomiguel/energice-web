'use client';

import { RiWaterFlashFill } from 'react-icons/ri';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StartPlungeBtn from './start-plunge-btn';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import { User } from '@prisma/client';
import H2 from './h2';

export default function StartPlungeSection({
  isOnboarded,
  paidCredits,
}: {
  isOnboarded: boolean;
  paidCredits?: User['paidCredits'];
}) {
  const { numberOfSessions: plungeSessionsNum } = usePlungeSessions();

  if (!isOnboarded) {
    return null;
  }

  if (plungeSessionsNum === 0) {
    return (
      <section>
        <StartFirstPlungeAlert paidCredits={paidCredits} />
      </section>
    );
  }

  return (
    <section>
      <H2 className="mb-3">Start plunge</H2>
      <StartNewPlungeAlert paidCredits={paidCredits} />
    </section>
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
        <AlertDescription>Take your first plunge and feel amazing!</AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start first plunge</StartPlungeBtn>
        </div>
        {paidCredits && paidCredits > 0 ? (
          <AlertDescription className="text-end">
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
        <AlertTitle>New plunge session</AlertTitle>
        <AlertDescription>Feel amazing in just a few minutes</AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start session</StartPlungeBtn>
        </div>
        {paidCredits && paidCredits > 0 ? (
          <AlertDescription className="text-end">
            Plunge credits: <span className="font-semibold">{paidCredits}</span>
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}
