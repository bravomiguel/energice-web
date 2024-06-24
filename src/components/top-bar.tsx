'use client';

import { usePathname } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';

import { signOutAction, startSession } from '@/actions/actions';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ONBOARDING_PATHNAMES, RESET_PW_PATHNAME } from '@/lib/constants';

export default function TopBar() {
  const activePathname = usePathname();

  const isOnboarding = ONBOARDING_PATHNAMES.find(
    (pathName) => pathName === activePathname,
  );
  const isResetPassword = RESET_PW_PATHNAME === activePathname;
  const isUnit = activePathname.includes('/unit');
  const isUnlock = activePathname.includes('/unlock');

  const { activeSessionId, activeSession } = usePlungeSessions();
  const showSessionCountdown =
    activeSessionId && activeSession?.accessCode && isUnlock;

  const [sessionStartSecs, setSessionStartSecs] = useState<number | null>(null);
  // console.log({sessionStartSecs});

  useEffect(() => {
    if (showSessionCountdown) {
      const startNewSession = async () => {
        const response = await startSession({
          sessionId: activeSessionId,
        });
        if (response?.error) {
          console.error({ error: response?.error });
        }
      };

      const storedSessionStartSecs = localStorage.getItem('sessionStartSecs');
      if (!storedSessionStartSecs && !sessionStartSecs) {
        localStorage.setItem('sessionStartSecs', JSON.stringify(15));
      }

      if (!sessionStartSecs) {
        setSessionStartSecs(() => {
          const storedSessionStartSecs =
            localStorage.getItem('sessionStartSecs');
          return storedSessionStartSecs
            ? JSON.parse(storedSessionStartSecs)
            : 0;
        });
      }

      const intervalId = setInterval(() => {
        if (sessionStartSecs && sessionStartSecs > 0) {
          setSessionStartSecs(sessionStartSecs - 1);
          localStorage.setItem(
            'sessionStartSecs',
            JSON.stringify(sessionStartSecs - 1),
          );
        } else {
          clearInterval(intervalId);
        }
      }, 1000);

      if (sessionStartSecs === 0) {
        localStorage.removeItem('sessionStartSecs');
        startNewSession();
      }

      return () => clearInterval(intervalId);
    }
  }, [activeSessionId, showSessionCountdown, sessionStartSecs]);

  return (
    <header className="relative w-full flex justify-between items-center pt-3">
      {/* <SessionStartingCountdown /> */}
      {showSessionCountdown && (
        <div className="transition w-screen -mx-4 px-4 py-4 bg-green-koldup text-zinc-200 text-lg font-medium text-center flex justify-between items-center">
          <p>
            Session starting in{' '}
            <span className="text-2xl font-semibold">{sessionStartSecs}</span>
          </p>
          <Button
            variant="outline"
            className="text-zinc-300 hover:text-zinc-500"
            onClick={async () => {
              localStorage.removeItem('sessionStartSecs');
              const response = await startSession({
                sessionId: activeSessionId,
              });
              if (response?.error) {
                console.error({ error: response?.error });
              }
            }}
          >
            Start
          </Button>
        </div>
      )}
      <nav className="w-full">
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
    <li className='self-start translate-y-1'>
      <Link href={'/profile'}>
        <FaUser className="w-5 h-5" />
      </Link>
    </li>
  );
}
