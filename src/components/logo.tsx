import Image from 'next/image';
import Link from 'next/link';

import logo from '../../public/koldup_text_zinc_100.svg';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt="PetSoft logo"
        className={cn('h-16', className)}
      />
    </Link>
  );
};

export default Logo;
