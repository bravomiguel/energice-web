'use client';

import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUserAlt, FaRegUser, FaUser } from 'react-icons/fa';

import { signOutAction, startSession } from '@/actions/actions';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ONBOARDING_PATHNAMES } from '@/lib/constants';
import Link from 'next/link';

export default function TopBar() {
  const router = useRouter();
  const activePathname = usePathname();
  const isOnboardingBackArrow = [
    ...ONBOARDING_PATHNAMES,
    '/reset-password',
  ].find((pathName) => pathName === activePathname);
  const isUnlockScreen = activePathname.includes('/unlock');
  const { activeSessionId, activeSession } = usePlungeSessions();
  const showSessionCountdown =
    activeSessionId && activeSession?.accessCode && isUnlockScreen;

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
    <header className="relative w-full flex justify-between items-center">
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
            {isOnboardingBackArrow && (
              <>
                <BackArrow label="Signin" handler={signOutAction} />
                <ProfileLink />
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
}: {
  label?: string;
  handler: () => Promise<void>;
}) {
  return (
    <li
      className="flex items-center mt-2 mb-3"
      onClick={async () => await handler()}
    >
      <IoIosArrowBack className="h-8 w-8 text-indigo-700 -translate-x-2" />
      {label && <p className="-translate-x-3">{label}</p>}
    </li>
  );
}

function ProfileLink() {
  return (
    <li>
      <Link href={'/profile'}>
        <FaUser className="w-5 h-5" />
      </Link>
    </li>
  );
}
