'use client';

import { useSessionContext } from '@/contexts/session-context-provider';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

const TopNav = () => {
  const router = useRouter();
  const activePathname = usePathname();
  const showArrowBack = ['/plunge'].find(
    (pathName) => pathName === activePathname,
  );
  const { activeSessionId } = useSessionContext();

  useEffect(() => {
    if (activeSessionId) {
      // countdown logic
      // start timer counting down from 10
      // save in state to show timer in banner
      // when it gets to 0, redirect to session screen
    }
  }, [activeSessionId]);
  
  return (
    <header className="relative flex justify-between items-center mb-4 min-h-4">
      {/* <SessionStartingCountdown /> */}
      {activeSessionId && (
        <div className="transition w-screen -mx-4 px-4 py-4 bg-green-koldup text-zinc-200 text-lg font-medium text-center">
          Session starting in <span className="text-2xl font-semibold">10</span>
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
