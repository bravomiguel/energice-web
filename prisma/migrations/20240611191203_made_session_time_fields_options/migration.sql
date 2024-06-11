/*
  Warnings:

  - You are about to drop the column `plungeTime` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionTime` on the `Session` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "sessionStart" DATETIME,
    "sessionEnd" DATETIME,
    "penaltyCharged" BOOLEAN NOT NULL DEFAULT false,
    "plungeStart" DATETIME,
    "plungeEnd" DATETIME,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Session_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("createdAt", "id", "isActive", "penaltyCharged", "plungeEnd", "plungeStart", "sessionEnd", "sessionStart", "unitId", "updatedAt", "userId") SELECT "createdAt", "id", "isActive", "penaltyCharged", "plungeEnd", "plungeStart", "sessionEnd", "sessionStart", "unitId", "updatedAt", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check("Session");
PRAGMA foreign_keys=ON;
