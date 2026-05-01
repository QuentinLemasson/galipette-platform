-- CreateTable
CREATE TABLE "MagicItemType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MagicItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "typeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MagicItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MagicItemType_name_key" ON "MagicItemType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MagicItem_name_key" ON "MagicItem"("name");

-- CreateIndex
CREATE INDEX "MagicItem_typeId_idx" ON "MagicItem"("typeId");

-- AddForeignKey
ALTER TABLE "MagicItem" ADD CONSTRAINT "MagicItem_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "MagicItemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed default magic item types (French labels)
INSERT INTO "MagicItemType" ("name") VALUES
  ('Arme'),
  ('Armure'),
  ('Accessoire'),
  ('Potion'),
  ('Parchemin'),
  ('Bague'),
  ('Autre')
ON CONFLICT ("name") DO NOTHING;
