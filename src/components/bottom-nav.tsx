import { cn } from '@/lib/utils';

export default function BottomNav({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        'sticky bottom-0 overflow-hidden flex flex-col w-full gap-2 py-4 bg-zinc-100 z-10',
        className,
      )}
    >
      {children}
    </footer>
  );
}
