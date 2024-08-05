'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from 'react';
import Image from 'next/image';
import { Session } from '@prisma/client';
import { IoWarningOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

import { formatSecsToMins } from '@/lib/utils';
import Subtitle from './subtitle';
import BottomNav from './bottom-nav';
import { Button } from './ui/button';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';

const GIFS_GDRIVE_BASE_URL = `https://drive.usercontent.google.com/download`;
const GIFS_SUPABASE_BASE_URL = `https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public`;

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
      <div className="flex-1 h-full flex flex-col justify-center items-center gap-6 -translate-y-[10%] w-[300px] mx-auto">
        <IoWarningOutline className="h-16 w-16 text-red-500" />
        <Subtitle className="text-2xl text-zinc-600 font-normal text-center">
          Please give the plunge a quick skim
        </Subtitle>
        <div className="w-[300px] h-[220px] rounded-lg overflow-hidden flex justify-center items-center bg-gray-200 shadow-md">
          <Image
            src={
              process.env.VERCEL_ENV === 'preview'
                ? `${GIFS_GDRIVE_BASE_URL}?id=1QR1HgXOH9_0vUSMS9Un8eklYJNOxlHge`
                : process.env.VERCEL_ENV === 'production'
                ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/how-it-works-5.gif`
                : `/explainer-gifs/how-it-works-5.gif`
            }
            alt="cold plunge closed image"
            width={300}
            height={50}
          />
        </div>
        <Subtitle className="text-3xl text-zinc-900 font-medium flex flex-col gap-3 items-center">
          {`and close the lid in`}
          <span className="w-24 flex justify-start items-center text-red-500">
            {formatSecsToMins(closeSecsLeft)}
          </span>
        </Subtitle>
      </div>
      <BottomNav>
        <Button
          variant="destructive"
          className="w-full"
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
