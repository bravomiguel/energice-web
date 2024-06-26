'use client';

import { usePathname } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';

import { endSession, signOutAction, startSession } from '@/actions/actions';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ONBOARDING_PATHNAMES, RESET_PW_PATHNAME } from '@/lib/constants';
import { getTimeDiffSecs } from '@/lib/utils';

export default function TopBar() {
  const activePathname = usePathname();
  const isOnboarding = ONBOARDING_PATHNAMES.find(
    (pathName) => pathName === activePathname,
  );
  const isResetPassword = RESET_PW_PATHNAME === activePathname;
  const isUnit = activePathname.includes('/unit');

  const { activeSessionId, activeSessionSecsLeft, activePlungeSecs } =
    usePlungeSessions();
  const isSessionEnding = activeSessionSecsLeft
    ? activeSessionId && activeSessionSecsLeft <= 60
    : false;

  useEffect(() => {
    if (isSessionEnding && activeSessionId) {
      const endSessionAction = async () => {
        // clean out local storage
        localStorage.removeItem('countdownSecs');
        localStorage.removeItem('isTimerPlaying');
        // run end session server action
        const response = await endSession({
          sessionId: activeSessionId,
          totalPlungeSecs: activePlungeSecs,
        });
        if (response?.error) {
          console.error({ error: response.error });
        }
      };

      if (activeSessionSecsLeft === 0) {
        endSessionAction();
      }
    }
  }, [isSessionEnding, activeSessionSecsLeft, activeSessionId, activePlungeSecs]);

  return (
    <header className="relative w-full flex justify-between items-center">
      {isSessionEnding && (
        <SessionEndingBanner sessionStartSecs={activeSessionSecsLeft} />
      )}
      <nav className="w-full pt-3">
        <ul className="w-full flex gap-2 text-xs justify-between items-center text-indigo-800 ">
          <>
            {isOnboarding && (
              <>
                <BackArrow label="Signin" handler={signOutAction} />
                <ProfileLink />
              </>
            )}
            {isResetPassword && (
              <>
                <BackArrow label="Signin" handler={signOutAction} />
              </>
            )}
            {isUnit && (
              <>
                <BackArrow isLink={true} href="/" />
              </>
            )}
          </>
        </ul>
      </nav>
    </header>
  );
}

function SessionEndingBanner({
  sessionStartSecs,
}: {
  sessionStartSecs: number | null;
}) {
  return (
    <div className="transition w-screen -mx-4 px-4 py-4 bg-red-500 text-zinc-200 text-lg font-medium text-center flex justify-between items-center">
      <p>
        Session ending in{' '}
        <span className="text-2xl font-semibold">{sessionStartSecs}</span>
      </p>
    </div>
  );
}

function BackArrow({
  label,
  handler,
  isLink,
  href,
}: {
  label?: string;
  handler?: () => Promise<void>;
  isLink?: boolean;
  href?: any;
}) {
  if (isLink) {
    return (
      <li className="flex items-center -mt-1 mb-3">
        <Link href={href} className="w-full">
          <IoIosArrowBack className="h-8 w-8 text-indigo-700 -translate-x-2" />
          {label && <p className="-translate-x-3">{label}</p>}
        </Link>
      </li>
    );
  }

  if (!isLink && handler) {
    return (
      <li
        className="flex items-center -mt-1 mb-3"
        onClick={async () => await handler()}
      >
        <IoIosArrowBack className="h-8 w-8 text-indigo-700 -translate-x-2" />
        {label && <p className="-translate-x-3">{label}</p>}
      </li>
    );
  }
}

function ProfileLink() {
  return (
    <li className="self-start translate-y-1">
      <Link href={'/profile'}>
        <FaUser className="w-5 h-5" />
      </Link>
    </li>
  );
}
