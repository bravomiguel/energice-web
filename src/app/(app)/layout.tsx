import { Viewport } from 'next';

import { Toaster } from '@/components/ui/sonner';
import PlungeSessionsContextProvider from '@/contexts/sessions-context-provider';
import TopBar from '@/components/top-bar';
import { Session } from '@prisma/client';
import { checkAuth, getSessionsByprofileId } from '@/lib/server-utils';

export const viewport: Viewport = {
  themeColor: '#f4f4f5',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAuth();
  const plungeSessions = await getSessionsByprofileId(user.id);

  return (
    <>
      <div className="relative flex flex-col px-4 min-h-dvh w-full max-w-md overflow-x-hidden">
        <PlungeSessionsContextProvider data={plungeSessions}>
          {/* <PlungeSessionsContextProvider> */}
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
