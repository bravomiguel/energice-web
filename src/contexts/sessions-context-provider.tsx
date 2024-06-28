'use client';

import { createContext, useContext, useState } from 'react';

import { Session } from '@prisma/client';

type PlungeSessionsProviderProps = {
  data: Session[];
  children: React.ReactNode;
};

type TPlungeSessions = {
  sessions: Session[];
  activeSessionId: Session['id'] | null;
  handleChangeActiveSessionId: (id: Session['id']) => void;
  activeSession?: Session;
  activeSessionSecsLeft: number | null;
  handleChangeActiveSessionSecs: (sessionSecsLeft: number | null) => void;
  activePlungeSecs: number | null;
  handleChangeActivePlungeSecs: (plungeSecs: number) => void;
  numberOfSessions: number;
  overallPlungeSecs: number;
  currentStreakDays: number;
};

export const PlungeSessions = createContext<TPlungeSessions | null>(null);

export default function PlungeSessionsProvider({
  data: sessions,
  children,
}: PlungeSessionsProviderProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSessionSecsLeft, setActiveSessionSecsLeft] = useState<
    number | null
  >(null);
  const [activePlungeSecs, setActivePlungeSecs] = useState<number | null>(null);

  const activeSession = sessions.find(
    (session) => session.id === activeSessionId,
  );

  const handleChangeActiveSessionSecs = (sessionSecsLeft: number | null) => {
    setActiveSessionSecsLeft(sessionSecsLeft);
  };

  const handleChangeActivePlungeSecs = (plungeSecs: number) => {
    setActivePlungeSecs(plungeSecs);
  };

  const handleChangeActiveSessionId = (id: Session['id']) => {
    setActiveSessionId(id);
  };

  const numberOfSessions = sessions.length;

  let overallPlungeSecs;
  if (sessions.length === 0) {
    overallPlungeSecs = 0;
  } else {
    overallPlungeSecs = sessions
      .map((session) => (session.totalPlungeSecs ? session.totalPlungeSecs : 0))
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });
  }

  // --- max streak days calc ---

  // Convert session dates to Date objects and create a Set to store unique dates
  const uniqueSessionDatesTimeStamp = new Set(
    sessions
      .filter((session) => session.sessionStart !== null)
      .map((session) => {
        if (!session.sessionStart) return;
        let sessionStartSetToMidnight = new Date(session.sessionStart);
        sessionStartSetToMidnight.setHours(0, 0, 0, 0);
        return sessionStartSetToMidnight.getTime();
      }) as number[],
  );

  // Convert the Set back to an array and sort session dates
  const sessionDates = Array.from(uniqueSessionDatesTimeStamp)
    .sort((a, b) => a - b).map((dateTimeStamp) => {
      const date = new Date(dateTimeStamp);
      return date;
    });

  // console.log({ sessionDates });

  // Calculate streaks
  let currentStreakDays = 0;
  let lastDate = null;
  for (const date of sessionDates) {
    if (lastDate) {
      const diffTime = Math.abs(date.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreakDays++;
      } else {
        currentStreakDays = 1;
      }
    } else {
      currentStreakDays = 1;
    }
    lastDate = date;
  }

  // console.log({sessions});
  // console.log({uniqueSessionDates});
  // console.log({sessionDates});

  if (sessionDates.length > 0) {
    // Check if the last session was today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of today
    if (
      sessionDates[sessionDates.length - 1].toDateString() !==
      today.toDateString()
    ) {
      currentStreakDays = 0;
    }
  } else {
    currentStreakDays === 0;
  }

  return (
    <PlungeSessions.Provider
      value={{
        sessions,
        activeSessionId,
        handleChangeActiveSessionId,
        activeSession,
        activeSessionSecsLeft,
        handleChangeActiveSessionSecs,
        activePlungeSecs,
        handleChangeActivePlungeSecs,
        numberOfSessions,
        overallPlungeSecs,
        currentStreakDays,
      }}
    >
      {children}
    </PlungeSessions.Provider>
  );
}

export function usePlungeSessions() {
  const context = useContext(PlungeSessions);

  if (!context) {
    throw new Error(
      'usePlungeSessions must be used within a UnitSessionProvider',
    );
  }

  return context;
}
