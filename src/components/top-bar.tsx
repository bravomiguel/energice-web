'use client';

import { usePathname } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';

import { endSession, signOut } from '@/actions/actions';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import { useEffect } from 'react';
import { ONBOARDING_PATHNAMES } from '@/lib/constants';
import { formatSecsToMins } from '@/lib/utils';
import { toast } from 'sonner';

export default function TopBar() {
  const activePathname = usePathname();
  const isOnboarding = ONBOARDING_PATHNAMES.find(
    (pathName) => pathName === activePathname,
  );
  const isUnit = activePathname.includes('/unit');

  const { activeSessionId, activeSessionSecsLeft, activePlungeSecs } =
    usePlungeSessions();
  const isSessionEnding = activeSessionSecsLeft
    ? activeSessionSecsLeft <= 30
    : false;

  useEffect(() => {
    if (isSessionEnding && activeSessionId) {
      const handlEndSession = async () => {
        // run end session server action
        const response = await endSession({
          sessionId: activeSessionId,
          totalPlungeSecs: activePlungeSecs,
        });
        if (response?.error) {
          console.error({ error: response.error });
          toast.error(response.error);
        }
      };

      if (activeSessionSecsLeft === 0) {
        handlEndSession();
      }
    }
  }, [
    isSessionEnding,
    activeSessionSecsLeft,
    activeSessionId,
    activePlungeSecs,
  ]);

  if (isSessionEnding) {
    return (
      <header className="relative w-full flex justify-between items-center mb-2 transition-all">
        <SessionEndingBanner sessionStartSecs={activeSessionSecsLeft} />
      </header>
    );
  }

  return (
    <header className="relative w-full flex justify-between items-center">
      <nav className="w-full pt-3">
        <ul className="w-full flex gap-2 text-xs justify-between items-center text-indigo-800 ">
          <>
            {isOnboarding && (
              <>
                <BackArrow label="Signin" handler={signOut} />
                <ProfileLink />
              </>
            )}
            {isUnit && (  
              <>
                <BackArrow href="/" />
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
    <div className="transition w-screen -mx-4 px-4 py-3 bg-red-500 text-zinc-200 text-lg font-medium text-center flex justify-center items-center gap-1.5">
      <p className="self-end">Session ending in </p>
      <>
        {sessionStartSecs ? (
          <span className="text-2xl font-semibold w-20 flex justify-start items-center text-start">
            {formatSecsToMins(sessionStartSecs)}
          </span>
        ) : null}
      </>
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
          <IoIosArrowBack className="h-7 w-7 text-indigo-700 -translate-x-2" />
          {label && <p className="-translate-x-3">{label}</p>}
        </Link>
      </li>
    );
  }

  if (!isLink && handler) {
    return (
      <li
        className="flex items-center -mt-1 mb-3 cursor-pointer"
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
