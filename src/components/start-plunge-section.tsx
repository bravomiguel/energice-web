'use client';

import { RiWaterFlashFill } from 'react-icons/ri';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StartPlungeBtn from './buttons/start-plunge-btn';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import { Profile } from '@prisma/client';
import H2 from './h2';

export default function StartPlungeSection({
  isOnboarded,
  credits,
  isMember,
}: {
  isOnboarded: boolean;
  credits?: Profile['credits'];
  isMember: Profile['isMember'];
}) {
  const { numberOfSessions: plungeSessionsNum } = usePlungeSessions();

  if (!isOnboarded) {
    return null;
  }

  if (plungeSessionsNum === 0) {
    return (
      <section>
        <StartFirstPlungeAlert credits={credits} isMember={isMember} />
      </section>
    );
  }

  return (
    <section>
      <H2 className="mb-3">Start plunge</H2>
      <StartNewPlungeAlert credits={credits} isMember={isMember} />
    </section>
  );
}

function StartFirstPlungeAlert({
  credits,
  isMember,
}: {
  credits?: Profile['credits'];
  isMember: Profile['isMember'];
}) {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>No plunges yet</AlertTitle>
        <AlertDescription>
          {isMember || credits
            ? `Take your first plunge and feel amazing!`
            : `Start plunging for just $9 per session`}
        </AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start first plunge</StartPlungeBtn>
        </div>
        {isMember ? (
          <AlertDescription className="font-semibold text-end">
            Unlimited access
          </AlertDescription>
        ) : credits && credits > 0 ? (
          <AlertDescription className="font-semibold text-end">
            {`Plunge credits:  ${credits}`}
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}

function StartNewPlungeAlert({
  credits,
  isMember,
}: {
  credits?: Profile['credits'];
  isMember: Profile['isMember'];
}) {
  return (
    <Alert className="bg-indigo-100 text-zinc-700 pr-10 pt-5">
      <RiWaterFlashFill className="h-5 w-5 fill-indigo-800" />
      <div className="space-y-3">
        <AlertTitle>New plunge session</AlertTitle>
        <AlertDescription>
          {isMember || credits
            ? `Feel amazing in just a few minutes`
            : `Get plunging for just $9 per session`}
        </AlertDescription>
        <div className="flex flex-col w-full">
          <StartPlungeBtn>Start session</StartPlungeBtn>
        </div>
        {isMember ? (
          <AlertDescription className="font-semibold text-end">
            Unlimited access
          </AlertDescription>
        ) : credits && credits > 0 ? (
          <AlertDescription className="font-semibold text-end">
            {`Plunge credits:  ${credits}`}
          </AlertDescription>
        ) : null}
      </div>
    </Alert>
  );
}
