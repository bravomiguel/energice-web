/*
  Warnings:

  - Added the required column `updatedAt` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gym" TEXT NOT NULL,
    "lockDeviceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Unit" ("gym", "id", "lockDeviceId") SELECT "gym", "id", "lockDeviceId" FROM "Unit";
DROP TABLE "Unit";
ALTER TABLE "new_Unit" RENAME TO "Unit";
PRAGMA foreign_key_check("Unit");
PRAGMA foreign_keys=ON;
