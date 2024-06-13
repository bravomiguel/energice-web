'use client';

import { cn } from '@/lib/utils';
import { Session } from '@prisma/client';

export default function SessionDisplay({
  // sessionData,
  className,
}: {
  // sessionData: Session;
  className?: string;
}) {
  return <div className={cn(className)}>SessionDisplay</div>;
}
