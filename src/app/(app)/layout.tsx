import { Toaster } from '@/components/ui/sonner';
import UnitContextProvider from '@/contexts/unit-context-provider';
import SessionContextProvider from '@/contexts/session-context-provider';
import prisma from '@/lib/db';
import TopNav from '@/components/top-nav';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const units = await prisma.unit.findMany();
  const sessions = await prisma.session.findMany();

  return (
    <>
      <div className="relative flex flex-col px-4 min-h-screen">
        <TopNav />
        <UnitContextProvider data={units}>
          <SessionContextProvider data={sessions}>
            {children}
          </SessionContextProvider>
        </UnitContextProvider>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
