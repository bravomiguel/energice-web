'use client';

import { useRouter } from 'next/navigation';

import BottomNav from './bottom-nav';
import { Button } from './ui/button';
import { useTransition } from 'react';

export default function NextNavBtn({toPath, btnLabel, isDisabled}: {toPath: string; btnLabel: string; isDisabled?: boolean}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigateToQuiz = async () => {
    startTransition(async () => {
      router.push(toPath);
    });
  };
  return (
    <BottomNav className="flex w-full gap-3 justify-center items-center">
      <Button
        className="w-full"
        onClick={async () => await navigateToQuiz()}
        disabled={isPending || isDisabled}
        isLoading={isPending}
      >
        {btnLabel}
      </Button>
    </BottomNav>
  );
}
