'use client';

import { startActiveSession } from '@/actions/actions';
import { useSessionContext } from '@/contexts/session-context-provider';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Button } from './ui/button';

const TopNav = () => {
  const router = useRouter();
  const activePathname = usePathname();
  const showArrowBack = ['/plunge'].find(
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
      const startSession = async () => {
        const response = await startActiveSession({
          sessionId: activeSessionId,
        });
        if (response?.error) {
          console.error({ error: response?.error });
        }
      };

      const storedSessionStartSecs = localStorage.getItem('sessionStartSecs');
      if (!storedSessionStartSecs && !sessionStartSecs) {
        localStorage.setItem('sessionStartSecs', JSON.stringify(10));
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
        startSession();
      }

      return () => clearInterval(intervalId);
    }
  }, [activeSessionId, showSessionCountdown, sessionStartSecs]);

  return (
    <header className="relative flex justify-between items-center mb-4 min-h-4">
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
              const response = await startActiveSession({
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
            <button onClick={() => router.back()}>
              {showArrowBack && (
                <IoIosArrowBack
                  className={cn('h-8 w-8 text-indigo-700 -translate-x-2', {
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
};

export default TopNav;
