/*
  Warnings:

  - You are about to drop the column `gym` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `gymAddress` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `gymGMapsPlaceId` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `hostAddress` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostGMapsPlaceId` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostName` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "hostAddress" TEXT NOT NULL,
    "hostGMapsPlaceId" TEXT NOT NULL,
    "lockDeviceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Unit" ("createdAt", "id", "lockDeviceId", "updatedAt") SELECT "createdAt", "id", "lockDeviceId", "updatedAt" FROM "Unit";
DROP TABLE "Unit";
ALTER TABLE "new_Unit" RENAME TO "Unit";
PRAGMA foreign_key_check("Unit");
PRAGMA foreign_keys=ON;
