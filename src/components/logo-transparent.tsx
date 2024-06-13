import Image from 'next/image';
import Link from 'next/link';

import logo from '../../public/koldup_logo_zinc_100.png';
import { cn } from '@/lib/utils';

export default function LogoTransparent({ className }: { className?: string }) {
  return (
    // <Link href="/">
      <Image
        src={logo}
        alt="Koldup logo"
        className={cn('h-16 w-16', className)}
      />
    // </Link>
  );
};
