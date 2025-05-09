'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from 'react';
import { Session } from '@prisma/client';
import { IoWarningOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import ReactPlayer from 'react-player/lazy';

import { formatSecsToMins } from '@/lib/utils';
import Subtitle from './subtitle';
import BottomNav from './bottom-nav';
import { Button } from './ui/button';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import { GCLOUD_BASE_URL } from '@/lib/constants';
import Image from 'next/image';

// const GDRIVE_BASE_URL = `https://drive.usercontent.google.com/download`;
const SUPABASE_BASE_URL = `https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public`;

export default function CloseLidDisplay({
  sessionId,
  closeSecs,
}: {
  sessionId: Session['id'];
  closeSecs: number;
}) {
  const [closeSecsLeft, setCloseSecsLeft] = useState(closeSecs);
  console.log({ closeSecsLeft });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { handleChangeActiveSessionSecs } = usePlungeSessions();

  const handleConfirm = useCallback(async () => {
    startTransition(async () => {
      router.push(`/session/${sessionId}/success`);
    });
  }, [sessionId, router]);

  useEffect(() => {
    // clean out local storage
    localStorage.clear();
  }, []);

  useEffect(() => {
    const closeTimeId = setInterval(() => {
      if (closeSecsLeft > 0) {
        setCloseSecsLeft((prev) => prev - 1);
      } else {
        clearInterval(closeTimeId);
      }
    }, 1000);

    if (closeSecsLeft <= 0) {
      handleConfirm();
    }

    return () => clearInterval(closeTimeId);
  }, [closeSecsLeft, handleConfirm]);

  useLayoutEffect(() => {
    // reset active session secs in local state
    handleChangeActiveSessionSecs(null);
  }, [handleChangeActiveSessionSecs]);

  return (
    <>
      <div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-6 -translate-y-[10%]">
        <IoWarningOutline className="h-16 w-16 text-red-500" />
        <Subtitle className="text-3xl text-zinc-900 font-medium flex flex-col gap-3 items-center">
          {`Close the lid in`}
          <span className="w-24 flex justify-start items-center text-red-500">
            {formatSecsToMins(closeSecsLeft)}
          </span>
        </Subtitle>
        <div className="w-[300px] h-[210px] rounded-lg overflow-hidden flex justify-center items-center bg-gray-200 shadow-md">
          <Image
            src="/koldup_plunge.jpeg"
            alt="cold plunge open image"
            width={300}
            height={50}
          />
        </div>
      </div>
      <BottomNav>
        <Button
          variant="destructive"
          className="w-full h-16"
          disabled={isPending}
          isLoading={isPending}
          onClick={handleConfirm}
        >
          Done
        </Button>
      </BottomNav>
    </>
  );
}
