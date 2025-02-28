-- CreateEnum
CREATE TYPE "Membership" AS ENUM ('monthly', 'halfyearly', 'yearly');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "membership" "Membership" NOT NULL,
    "validTill" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
