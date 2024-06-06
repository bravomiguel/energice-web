-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "dob" DATETIME,
    "isWaiverSigned" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recreatedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "deleted", "deletedAt", "dob", "email", "firstName", "hashedPassword", "id", "isWaiverSigned", "lastName", "recreatedAt", "updatedAt") SELECT "createdAt", "deleted", "deletedAt", "dob", "email", "firstName", "hashedPassword", "id", "isWaiverSigned", "lastName", "recreatedAt", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;
