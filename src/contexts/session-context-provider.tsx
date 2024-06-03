'use client';

import { createContext, useContext, useOptimistic, useState } from 'react';

// import { addPet, checkoutPet, editPet } from '@/actions/actions';
// import { toast } from 'sonner';
import { Session } from '@prisma/client';
import { SessionEssentials } from '@/lib/types';

type SessionContextProviderProps = {
  data: Session[];
  children: React.ReactNode;
};

type TSessionContext = {
  sessions: Session[];
  selectedSessionId: Session['id'] | null;
  selectedSession: Session | undefined;
  numberOfSessions: number;
  handleAddSession: (newSession: SessionEssentials) => Promise<void>;
};

export const SessionContext = createContext<TSessionContext | null>(null);

export default function SessionContextProvider({
  data: sessions,
  children,
}: SessionContextProviderProps) {
  // const [sessions, setSessions] = useState(data);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const selectedSession = sessions.find((session) => session.id === selectedSessionId);
  const numberOfSessions = sessions.length;

  const handleChangeSelectedSessionId = (id: Session['id']) => {
    setSelectedSessionId(id);
  };

  const handleAddSession = async (newSession: SessionEssentials) => {
    // const error = await addSession(newSession);
    // if (error) {
    //   toast.warning(error.message);
    //   return;
    // }
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        selectedSessionId,
        selectedSession,
        numberOfSessions,
        handleAddSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useUnitContext() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSessionContext must be used within a UnitSessionProvider');
  }

  return context;
}

