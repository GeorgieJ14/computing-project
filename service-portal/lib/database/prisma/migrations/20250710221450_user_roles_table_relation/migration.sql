/*
  Warnings:

  - The primary key for the `Attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Attachment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `ticketId` on the `Attachment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `ticketId` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `categoryId` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticketId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contentType" TEXT,
    "fileName" TEXT NOT NULL,
    "size" INTEGER,
    "description" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedById" TEXT,
    CONSTRAINT "Attachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("contentType", "createdAt", "createdById", "deletedAt", "deletedById", "description", "fileName", "id", "size", "ticketId", "type", "updatedAt", "updatedById", "url", "userId") SELECT "contentType", "createdAt", "createdById", "deletedAt", "deletedById", "description", "fileName", "id", "size", "ticketId", "type", "updatedAt", "updatedById", "url", "userId" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedById" TEXT,
    CONSTRAINT "Category_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Category_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Category_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "createdById", "deletedAt", "deletedById", "description", "id", "name", "updatedAt", "updatedById") SELECT "createdAt", "createdById", "deletedAt", "deletedById", "description", "id", "name", "updatedAt", "updatedById" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticketId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedById" TEXT,
    CONSTRAINT "Comment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("content", "createdAt", "createdById", "deletedAt", "deletedById", "id", "ticketId", "updatedAt", "updatedById", "userId") SELECT "content", "createdAt", "createdById", "deletedAt", "deletedById", "id", "ticketId", "updatedAt", "updatedById", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assignedTo" TEXT,
    "tags" TEXT,
    "categoryId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedById" TEXT,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assignedTo", "categoryId", "createdAt", "createdById", "date", "deletedAt", "deletedById", "details", "id", "priority", "status", "tags", "title", "updatedAt", "updatedById", "userId") SELECT "assignedTo", "categoryId", "createdAt", "createdById", "date", "deletedAt", "deletedById", "details", "id", "priority", "status", "tags", "title", "updatedAt", "updatedById", "userId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image_url" TEXT,
    "roleId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdById" TEXT,
    "updatedById" TEXT,
    "deletedById" TEXT,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "createdById", "deletedAt", "deletedById", "email", "emailVerified", "id", "image_url", "name", "password", "updatedAt", "updatedById") SELECT "createdAt", "createdById", "deletedAt", "deletedById", "email", "emailVerified", "id", "image_url", "name", "password", "updatedAt", "updatedById" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
