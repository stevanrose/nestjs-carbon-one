-- CreateEnum
CREATE TYPE "CommuteMode" AS ENUM ('car_petrol', 'car_diesel', 'car_hybrid', 'car_ev', 'bus', 'train', 'metro', 'bike', 'walk', 'remote');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'contractor');

-- CreateEnum
CREATE TYPE "HeatingFuelType" AS ENUM ('none', 'natural_gas', 'district_heat', 'oil', 'other');

-- CreateEnum
CREATE TYPE "WorkPattern" AS ENUM ('office', 'remote', 'hybrid');

-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "gridRegionCode" TEXT NOT NULL,
    "floorAreaM2" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'full_time',
    "workPattern" "WorkPattern" NOT NULL DEFAULT 'hybrid',
    "officeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeEnergyStatement" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "electricityKwh" DOUBLE PRECISION NOT NULL,
    "heatingFuelType" "HeatingFuelType" NOT NULL DEFAULT 'none',
    "heatingEnergyKwh" DOUBLE PRECISION,
    "renewablePpasKwh" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeEnergyStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommuteSurvey" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "surveyDate" TIMESTAMP(3) NOT NULL,
    "primaryMode" "CommuteMode" NOT NULL,
    "oneWayDistanceKm" DOUBLE PRECISION NOT NULL,
    "daysPerWeekCommuting" INTEGER NOT NULL,
    "carOccupancy" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommuteSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_code_key" ON "Office"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_officeId_idx" ON "Employee"("officeId");

-- CreateIndex
CREATE INDEX "OfficeEnergyStatement_officeId_year_month_idx" ON "OfficeEnergyStatement"("officeId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeEnergyStatement_officeId_year_month_key" ON "OfficeEnergyStatement"("officeId", "year", "month");

-- CreateIndex
CREATE INDEX "CommuteSurvey_employeeId_surveyDate_idx" ON "CommuteSurvey"("employeeId", "surveyDate");

-- CreateIndex
CREATE UNIQUE INDEX "CommuteSurvey_employeeId_surveyDate_key" ON "CommuteSurvey"("employeeId", "surveyDate");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeEnergyStatement" ADD CONSTRAINT "OfficeEnergyStatement_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommuteSurvey" ADD CONSTRAINT "CommuteSurvey_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
