-- CreateTable
CREATE TABLE "public"."water_bodies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "water_bodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."water_body_questionnaires" (
    "id" TEXT NOT NULL,
    "waterBodyId" TEXT NOT NULL,
    "waterClarityRating" INTEGER NOT NULL,
    "fishPresence" BOOLEAN NOT NULL,
    "birdPresence" BOOLEAN NOT NULL,
    "otherWildlife" BOOLEAN NOT NULL,
    "biodiversityNotes" TEXT,
    "vegetationDensity" INTEGER NOT NULL,
    "vegetationTypes" TEXT[],
    "generalNotes" TEXT,
    "userLatitude" DOUBLE PRECISION,
    "userLongitude" DOUBLE PRECISION,
    "userName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "water_body_questionnaires_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."water_body_questionnaires" ADD CONSTRAINT "water_body_questionnaires_waterBodyId_fkey" FOREIGN KEY ("waterBodyId") REFERENCES "public"."water_bodies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
