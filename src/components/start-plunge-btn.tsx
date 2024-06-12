'use client';

import { createActiveSession, createLockCode } from '@/actions/actions';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function StartPlungeBtn({
  disabled,
  unitId,
  lockDeviceId,
}: {
  disabled: boolean;
  unitId: string;
  lockDeviceId: string;
}) {
  const router = useRouter();
  return (
    <Button
      disabled={disabled}
      className="flex-1"
      onClick={async () => {
        // create new lock code
        // const response = await createLockCode({
        //   lockDeviceId,
        //   minsLaterEndTime: 5,
        // });
        // if (response?.error) {
        //   console.error({ error: response.error });
        // }
        // router.push(`/plunge/${unitId}/unlock`);
        const response = await createActiveSession({
          unitId,
          assignCode: true,
        });
        if (response?.error) {
          console.error({ error: response.error });
        }
      }}
    >
      Start Plunge
    </Button>
  );
}
