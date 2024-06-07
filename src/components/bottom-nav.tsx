import { cn } from "@/lib/utils";

export default function BottomNav({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <footer className={cn("sticky bottom-0 py-5 bg-zinc-100 z-10", className)}>
      {children}
    </footer>
  );
}
