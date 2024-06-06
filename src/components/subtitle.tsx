import { cn } from '@/lib/utils';

type SubtitleProps = {
  children: React.ReactNode;
  className?: string;
};

const Subtitle = ({ children, className }: SubtitleProps) => {
  return (
    <p className={cn('font-medium text-zinc-500', className)}>
      {children}
    </p>
  );
};

export default Subtitle;
