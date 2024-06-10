/*
  Warnings:

  - Added the required column `gymAddress` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymPlaceId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gym" TEXT NOT NULL,
    "gymAddress" TEXT NOT NULL,
    "gymPlaceId" TEXT NOT NULL,
    "lockDeviceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Unit" ("createdAt", "gym", "id", "lockDeviceId", "updatedAt") SELECT "createdAt", "gym", "id", "lockDeviceId", "updatedAt" FROM "Unit";
DROP TABLE "Unit";
ALTER TABLE "new_Unit" RENAME TO "Unit";
PRAGMA foreign_key_check("Unit");
PRAGMA foreign_keys=ON;
