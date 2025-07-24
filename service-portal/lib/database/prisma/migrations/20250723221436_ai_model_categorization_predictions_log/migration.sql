-- CreateTable
CREATE TABLE "AIModelPrediction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    CONSTRAINT "AIModelPrediction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HuggingFaceAPI" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "ticketId" INTEGER,
    "categoryPredictionLogId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    CONSTRAINT "HuggingFaceAPI_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HuggingFaceAPI_categoryPredictionLogId_fkey" FOREIGN KEY ("categoryPredictionLogId") REFERENCES "AIModelPrediction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HuggingFaceAPI" ("createdAt", "deletedAt", "id", "model", "prompt", "response", "ticketId", "updatedAt") SELECT "createdAt", "deletedAt", "id", "model", "prompt", "response", "ticketId", "updatedAt" FROM "HuggingFaceAPI";
DROP TABLE "HuggingFaceAPI";
ALTER TABLE "new_HuggingFaceAPI" RENAME TO "HuggingFaceAPI";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
