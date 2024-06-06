import AppNav from '@/components/app-nav';
import { Toaster } from '@/components/ui/sonner';
import UnitContextProvider from '@/contexts/unit-context-provider';
import SessionContextProvider from '@/contexts/session-context-provider';
import prisma from '@/lib/db';
import AppHeader from '@/components/app-header';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const units = await prisma.unit.findMany();
  const sessions = await prisma.session.findMany();

  return (
    <>
      <div className="flex flex-col px-4 pb-4 min-h-screen">
        <AppHeader />
        <UnitContextProvider data={units}>
          <SessionContextProvider data={sessions}>
            {children}
          </SessionContextProvider>
        </UnitContextProvider>
        {/* <AppNav /> */}
      </div>
      <Toaster position="top-right" />
    </>
  );
}
