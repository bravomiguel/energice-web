'use client';

import { formatSecsToMins } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion';

const confettiProps: ConfettiProps = {
  force: 0.6,
  duration: 2500,
  particleCount: 80,
  width: 1000,
};

export default function SuccessPlungeTime({
  plungeSecs,
}: {
  plungeSecs: number;
}) {
  const [isExploding, setIsExploding] = useState(false);

  return (
    <div className="relative rounded-md border-8 border-green-koldup bg-transparent text-center py-4 px-9 flex items-center justify-center text-5xl font-semibold">
      {formatSecsToMins(plungeSecs)}
      {isExploding && <ConfettiExplosion {...confettiProps} />}
    </div>
  );
}
