import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../public/energice_logo.svg';
import { cn } from '@/lib/utils';

export default function LogoTransparent({ className }: { className?: string }) {
  return (
    // <Link href="/">
      <Image
        src={logo}
        alt="logo"
        className={cn('h-16 w-16', className)}
      />
    // </Link>
  );
};
