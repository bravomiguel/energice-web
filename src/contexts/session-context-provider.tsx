'use client';

import { createContext, useContext, useOptimistic, useState } from 'react';

// import { addPet, checkoutPet, editPet } from '@/actions/actions';
// import { toast } from 'sonner';
import { Session } from '@prisma/client';
// import { SessionEssentials } from '@/lib/types';

type SessionContextProviderProps = {
  data: Session[];
  children: React.ReactNode;
};

type TSessionContext = {
  sessions: Session[];
  activeSessionId: Session['id'] | null;
  activeSession: Session | undefined;
  numberOfSessions: number;
  // handleAddSession: (newSession: SessionEssentials) => Promise<void>;
};

export const SessionContext = createContext<TSessionContext | null>(null);

export default function SessionContextProvider({
  data: sessions,
  children,
}: SessionContextProviderProps) {
  // const [sessions, setSessions] = useState(data);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession = sessions.find((session) => session.id === activeSessionId);
  const numberOfSessions = sessions.length;

  const handleChangeActiveSessionId = (id: Session['id']) => {
    setActiveSessionId(id);
  };

  // const handleAddSession = async (newSession: SessionEssentials) => {
  //   // const error = await addSession(newSession);
  //   // if (error) {
  //   //   toast.warning(error.message);
  //   //   return;
  //   // }
  // };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        numberOfSessions,
        // handleAddSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSessionContext must be used within a UnitSessionProvider');
  }

  return context;
}

