'use client';

import { formatSecsToMins } from '@/lib/utils';
import { Dispatch, SetStateAction, useEffect } from 'react';

export default function CodeExpiryCountdown({
  countdownSecs,
  setCountdownSecs,
}: {
  countdownSecs: number | null;
  setCountdownSecs: Dispatch<SetStateAction<number | null>>;
}) {
  if (!countdownSecs) return null;

  return (
    <p className="absolute bottom-0 right-0 text-xs px-2 py-1 text-zinc-500 flex gap-1">
      Expires in
      <span className="flex justify-start items-center w-8">
        {formatSecsToMins(countdownSecs)}
      </span>
    </p>
  );
}
