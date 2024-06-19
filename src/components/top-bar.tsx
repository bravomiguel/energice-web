'use client';

import { startSession } from '@/actions/actions';
import { useSessionContext } from '@/contexts/session-context-provider';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Button } from './ui/button';

export default function TopBar() {
  const router = useRouter();
  const activePathname = usePathname();
  const showArrowBack = ['/reset-password'].find(
    (pathName) => pathName === activePathname,
  );
  const isUnlockScreen = activePathname.includes('/unlock');
  const { activeSessionId, activeSession } = useSessionContext();
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
    <header className="relative flex justify-between items-center">
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
      <nav>
        <ul className="flex gap-2 text-xs">
          <li>
            <button
              onClick={async () => {
                // if (!handleArrowBack) {
                  router.back();
                // }
                // await handleArrowBack();
              }}
            >
              {showArrowBack && (
                <IoIosArrowBack
                  className={cn('h-8 w-8 text-indigo-700 -translate-x-2 my-2', {
                    invisible: !showArrowBack,
                  })}
                />
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
