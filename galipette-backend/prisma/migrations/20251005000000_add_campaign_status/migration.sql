-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE';
