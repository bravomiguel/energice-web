'use client';

import { usePathname, useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';

const AppHeader = () => {
  const router = useRouter();
  const activePathname = usePathname();
  const showArrowBack = ['/plunge'].find(
    (pathName) => pathName === activePathname,
  );
  return (
    <header className="flex justify-between items-center h-8 mb-4">
      <nav>
        <ul className="flex gap-2 text-xs">
          <li>
            <button onClick={() => router.back()}>
              {showArrowBack && (
                <IoIosArrowBack className="h-8 w-8 text-indigo-700 -translate-x-2" />
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
