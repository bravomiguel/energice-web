/*
  Warnings:

  - You are about to drop the column `plungePauseTime` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `plungePaused` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionInProgress` on the `Session` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "sessionStart" DATETIME NOT NULL,
    "sessionEnd" DATETIME NOT NULL,
    "sessionTime" INTEGER NOT NULL,
    "penaltyCharged" BOOLEAN NOT NULL DEFAULT false,
    "plungeStart" DATETIME NOT NULL,
    "plungeEnd" DATETIME NOT NULL,
    "plungeTime" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Session_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("createdAt", "id", "penaltyCharged", "plungeEnd", "plungeStart", "plungeTime", "sessionEnd", "sessionStart", "sessionTime", "unitId", "updatedAt", "userId") SELECT "createdAt", "id", "penaltyCharged", "plungeEnd", "plungeStart", "plungeTime", "sessionEnd", "sessionStart", "sessionTime", "unitId", "updatedAt", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check("Session");
PRAGMA foreign_keys=ON;
