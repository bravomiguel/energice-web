'use client';

import { createContext, useContext, useOptimistic, useState } from 'react';

// import { addPet, checkoutPet, editPet } from '@/actions/actions';
// import { toast } from 'sonner';
import { Session } from '@prisma/client';
// import { SessionEssentials } from '@/lib/types';

type PlungeSessionsProviderProps = {
  data: Session[];
  children: React.ReactNode;
};

type TPlungeSessions = {
  sessions: Session[];
  activeSessionId: Session['id'] | null;
  handleChangeActiveSessionId: (id: Session['id']) => void;
  activeSession: Session | undefined;
  numberOfSessions: number;
  // handleAddSession: (newSession: SessionEssentials) => Promise<void>;
};

export const PlungeSessions = createContext<TPlungeSessions | null>(null);

export default function PlungeSessionsProvider({
  data: sessions,
  children,
}: PlungeSessionsProviderProps) {
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
    <PlungeSessions.Provider
      value={{
        sessions,
        activeSessionId,
        handleChangeActiveSessionId,
        activeSession,
        numberOfSessions,
        // handleAddSession,
      }}
    >
      {children}
    </PlungeSessions.Provider>
  );
}

export function usePlungeSessions() {
  const context = useContext(PlungeSessions);

  if (!context) {
    throw new Error('usePlungeSessions must be used within a UnitSessionProvider');
  }

  return context;
}

