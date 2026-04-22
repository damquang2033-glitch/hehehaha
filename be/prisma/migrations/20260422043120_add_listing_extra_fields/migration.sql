-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "beds" INTEGER,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "rentalType" TEXT,
ADD COLUMN     "structure" TEXT;
