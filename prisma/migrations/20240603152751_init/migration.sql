-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionInProgress" BOOLEAN NOT NULL DEFAULT false,
    "sessionStart" DATETIME NOT NULL,
    "sessionEnd" DATETIME NOT NULL,
    "sessionTime" INTEGER NOT NULL,
    "penaltyCharged" BOOLEAN NOT NULL DEFAULT false,
    "plungeStart" DATETIME NOT NULL,
    "plungeEnd" DATETIME NOT NULL,
    "plungePaused" BOOLEAN NOT NULL DEFAULT false,
    "plungePauseTime" INTEGER,
    "plungeTime" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Session_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gym" TEXT NOT NULL,
    "lockDeviceId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
