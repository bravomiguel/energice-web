import { cn } from '@/lib/utils';
import { IoWarningOutline } from 'react-icons/io5';

export default function PenaltyChargeWarning({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('flex gap-1.5 items-center', className)}>
      <IoWarningOutline className="ml-1 h-4 w-4 text-red-500 self-start" />
      <p className="text-600 text-red-500 font-semibold w-fit pr-2 text-xs">
        {`Don't forget to close the lid when you're done`}
      </p>
    </div>
  );
}
