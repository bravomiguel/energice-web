'use client';

import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';

export default function ShowPasswordToggle({
  passwordShow,
  setPasswordShow,
  className
}: {
  passwordShow: boolean;
  setPasswordShow: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) {
  return (
    <>
      {passwordShow ? (
        <BiSolidHide
          className={cn("text-indigo-900", className)}
          onClick={() => setPasswordShow(false)}
        />
      ) : (
        <BiSolidShow
          className={cn("text-indigo-900", className)}
          onClick={() => setPasswordShow(true)}
        />
      )}
    </>
  );
}
