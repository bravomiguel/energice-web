'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// import Logo from './logo';
import { cn } from '@/lib/utils';

const routes = [
  { label: 'Search', path: '/' },
  { label: 'Profile', path: '/profile' },
];

export default function AppNav() {
  const activePathname = usePathname();

  if (!routes.map((route) => route.path).includes(activePathname)) return null;

  return (
    <footer className="flex justify-between items-center border-b border-white/10 py-2 sticky bottom-0">
      <nav>
        <ul className="flex gap-2 text-xs">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  'text-zinc-900/70 rounded-sm px-2 py-1 hover:text-white focus:text-white transition',
                  { 'bg-indigo-800 text-zinc-200': route.path === activePathname },
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
