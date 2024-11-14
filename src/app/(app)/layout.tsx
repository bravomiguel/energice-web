import { Viewport } from 'next';

import { Toaster } from '@/components/ui/sonner';
import PlungeSessionsContextProvider from '@/contexts/sessions-context-provider';
import TopBar from '@/components/top-bar';
import {
  checkAuth,
  getAllUnits,
  getSessionsByUserId,
} from '@/lib/server-utils';
import { Session } from '@prisma/client';

export const viewport: Viewport = {
  themeColor: '#f4f4f5',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // auth check
  // const user = await checkAuth();

  // const plungeSessions = await getSessionsByUserId(user.id);
  const plungeSessions: Session[] | null = null;

  return (
    <>
      <div className="relative flex flex-col px-4 min-h-screen w-full max-w-md">
        {/* <PlungeSessionsContextProvider data={plungeSessions}> */}
        <PlungeSessionsContextProvider>
          <TopBar />
          {children}
        </PlungeSessionsContextProvider>
      </div>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: '#f4f4f5',
            border: '#a1a1aa',
          },
        }}
      />
    </>
  );
}
