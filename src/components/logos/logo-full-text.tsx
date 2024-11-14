import Image from 'next/image';
import Link from 'next/link';

import logoFullText from '../../public/energice_logo_text.svg';
import { cn } from '@/lib/utils';

export default function LogoFullText({ className }: { className?: string }) {
  return (
    // <Link href="/">
      <Image
        src={logoFullText}
        alt="Koldup full-text logo"
        className={cn('h-16', className)}
      />
    // </Link>
  );
};
