import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../public/sweat440-logo.png';
import { cn } from '@/lib/utils';

export default function Sweat440Logo({ className }: { className?: string }) {
  return (
    // <Link href="/">
      <Image
        src={logo}
        alt="logo"
        className={cn('w-16', className)}
      />
    // </Link>
  );
};
