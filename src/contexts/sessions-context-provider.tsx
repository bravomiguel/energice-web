'use client';

import { createContext, useContext, useState } from 'react';

import { Session } from '@prisma/client';

type PlungeSessionsProviderProps = {
  // data: Session[];
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
  avgPlungeSecs: number;
  currentStreakDays: number;
};

// export const PlungeSessions = createContext<TPlungeSessions | null>(null);
export const PlungeSessions = createContext<{}>({});

export default function PlungeSessionsProvider({
  // data: sessions,
  children,
}: PlungeSessionsProviderProps) {
  // const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  // const [activeSessionSecsLeft, setActiveSessionSecsLeft] = useState<
  //   number | null
  // >(null);
  // const [activePlungeSecs, setActivePlungeSecs] = useState<number | null>(null);

  // const activeSession = sessions.find(
  //   (session) => session.id === activeSessionId,
  // );

  // const handleChangeActiveSessionSecs = (sessionSecsLeft: number | null) => {
  //   setActiveSessionSecsLeft(sessionSecsLeft);
  // };

  // const handleChangeActivePlungeSecs = (plungeSecs: number) => {
  //   setActivePlungeSecs(plungeSecs);
  // };

  // const handleChangeActiveSessionId = (id: Session['id']) => {
  //   setActiveSessionId(id);
  // };

  // const numberOfSessions = sessions.filter(
  //   (session) => session.sessionStart !== null,
  // ).length;

  // let overallPlungeSecs;
  // let avgPlungeSecs;
  // if (numberOfSessions === 0) {
  //   overallPlungeSecs = 0;
  //   avgPlungeSecs = 0;
  // } else {
  //   overallPlungeSecs = sessions
  //     .filter((session) => session.sessionStart !== null)
  //     .map((session) => (session.totalPlungeSecs ? session.totalPlungeSecs : 0))
  //     .reduce((accumulator, currentValue) => {
  //       return accumulator + currentValue;
  //     });
    
  //     avgPlungeSecs = Math.floor(overallPlungeSecs / numberOfSessions);
  // }


  // // --- Streak days calc ---

  // // Convert session dates to Date objects and create a Set to store unique dates
  // const uniqueSessionDatesTimeStamp = new Set(
  //   sessions
  //     .filter((session) => session.sessionStart !== null)
  //     .map((session) => {
  //       if (!session.sessionStart) return;
  //       let sessionStartSetToMidnight = new Date(session.sessionStart);
  //       sessionStartSetToMidnight.setHours(0, 0, 0, 0);
  //       return sessionStartSetToMidnight.getTime();
  //     }) as number[],
  // );

  // // Convert the Set back to an array and sort session dates
  // const sessionDates = Array.from(uniqueSessionDatesTimeStamp)
  //   .sort((a, b) => b - a)
  //   .map((dateTimeStamp) => {
  //     const date = new Date(dateTimeStamp);
  //     return date;
  //   });

  // // const sessionDates = [
  // //   new Date('2024-07-08'),
  // //   new Date('2024-07-07'),
  // //   new Date('2024-07-06'),
  // //   new Date('2024-07-05'),
  // //   new Date('2024-07-03'),
  // // ]

  // // console.log({sessionDates});

  // // initialise streak days
  // let currentStreakDays = 0;
  // let nextDate = null;
  // const now = new Date();
  // const yesterday = new Date(now.setDate(now.getDate() - 1));
  // yesterday.setUTCHours(0, 0, 0, 0); // set to start of yesterday

  // // if no sessions, set streak to 0 and stop.
  // if (sessionDates.length === 0) {
  //   currentStreakDays = 0;
  // } else {
  //   // if latest session is before yesterday, set streak to 0 and stop.
  //   if (sessionDates[0].getTime() < yesterday.getTime()) {
  //     currentStreakDays = 0;
  //   } else {
  //     // loop through sessions
  //     for (const date of sessionDates) {
  //       // if there is only 1 session, set streak to 1 and stop.
  //       if (nextDate === null) {
  //         currentStreakDays = 1;
  //       } else {
  //         // count up streak days, starting with most recent one first
  //         const diffTime = Math.abs(nextDate.getTime() - date.getTime());
  //         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //         if (diffDays === 1) {
  //           currentStreakDays = currentStreakDays + 1;
  //         } else if (diffDays > 1) {
  //           break; // exit loop, as soon as diff days is greater than 1 (i.e. streak gets broken)
  //         }
  //       }
  //       nextDate = date;
  //     }
  //   }
  // }

  return (
    <PlungeSessions.Provider
      value={{
        // sessions,
        // activeSessionId,
        // handleChangeActiveSessionId,
        // activeSession,
        // activeSessionSecsLeft,
        // handleChangeActiveSessionSecs,
        // activePlungeSecs,
        // handleChangeActivePlungeSecs,
        // numberOfSessions,
        // overallPlungeSecs,
        // avgPlungeSecs,
        // currentStreakDays,
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
