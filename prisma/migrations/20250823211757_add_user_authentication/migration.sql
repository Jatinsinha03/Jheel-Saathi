/*
  Warnings:

  - You are about to drop the column `userName` on the `water_body_questionnaires` table. All the data in the column will be lost.
  - Added the required column `userId` to the `water_body_questionnaires` table without a default value. This is not possible if the table is not empty.

*/

-- First, create the users table
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create indexes for users table
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- Create a default user for existing questionnaires
INSERT INTO "public"."users" ("id", "email", "username", "password", "createdAt", "updatedAt")
VALUES (
    'default_user_placeholder',
    'default@example.com',
    'default_user',
    '$2a$12$placeholder_hash_for_default_user',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Add userId column to water_body_questionnaires table
ALTER TABLE "public"."water_body_questionnaires" ADD COLUMN "userId" TEXT;

-- Update existing questionnaires to use the default user
UPDATE "public"."water_body_questionnaires" 
SET "userId" = 'default_user_placeholder' 
WHERE "userId" IS NULL;

-- Make userId NOT NULL
ALTER TABLE "public"."water_body_questionnaires" ALTER COLUMN "userId" SET NOT NULL;

-- Drop the userName column
ALTER TABLE "public"."water_body_questionnaires" DROP COLUMN "userName";

-- Add foreign key constraint
ALTER TABLE "public"."water_body_questionnaires" ADD CONSTRAINT "water_body_questionnaires_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
