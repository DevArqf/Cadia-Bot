-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "countChannel" TEXT,
    "countHighscore" INTEGER NOT NULL DEFAULT 0,
    "countLastScore" INTEGER NOT NULL DEFAULT 0,
    "countLastUser" TEXT,
    "countLastDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countGoal" INTEGER NOT NULL DEFAULT 100,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "bank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountingReward" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "milestone" INTEGER NOT NULL,
    "reward" INTEGER NOT NULL,

    CONSTRAINT "CountingReward_pkey" PRIMARY KEY ("id")
);

