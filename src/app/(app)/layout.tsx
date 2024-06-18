import { Viewport } from 'next';

import { Toaster } from '@/components/ui/sonner';
import UnitContextProvider from '@/contexts/unit-context-provider';
import SessionContextProvider from '@/contexts/session-context-provider';
import TopBar from '@/components/top-bar';
import {
  checkAuth,
  getAllUnits,
  getSessionsByUserId,
} from '@/lib/server-utils';

export const viewport: Viewport = {
  themeColor: '#f4f4f5',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // auth check
  const session = await checkAuth();

  const units = await getAllUnits();
  const sessions = await getSessionsByUserId(session.user.id);

  return (
    <>
      <div className="relative flex flex-col px-4 min-h-screen">
        <SessionContextProvider data={sessions}>
          <TopBar />
          <UnitContextProvider data={units}>{children}</UnitContextProvider>
        </SessionContextProvider>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
