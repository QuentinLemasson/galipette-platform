-- Rename Race table to Ancestry
ALTER TABLE "Race" RENAME TO "Ancestry";

-- Rename raceId column to ancestryId in Character table
ALTER TABLE "Character" RENAME COLUMN "raceId" TO "ancestryId";

-- The foreign key constraint will be automatically renamed with the table
-- But we should update the constraint name for clarity
ALTER TABLE "Character" RENAME CONSTRAINT "Character_raceId_fkey" TO "Character_ancestryId_fkey";

