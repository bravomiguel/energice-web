import { cn } from '@/lib/utils';

type H2Props = {
  children: React.ReactNode;
  className?: string;
};

export default function H2 ({ children, className }: H2Props) {
  return (
    <h2 className={cn('font-medium text-xl leading-6', className)}>
      {children}
    </h2>
  );
};
