import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../public/sweat440-shield-white.png';
import { cn } from '@/lib/utils';

export default function Sweat440ShieldWhite({
  className,
}: {
  className?: string;
}) {
  return (
    // <Link href="/">
    <Image src={logo} alt="logo" className={cn('w-16 h-16', className)} />
    // </Link>
  );
}
