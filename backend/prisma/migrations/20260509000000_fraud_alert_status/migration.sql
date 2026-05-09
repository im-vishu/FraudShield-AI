-- CreateEnum
CREATE TYPE "FraudAlertStatus" AS ENUM ('NEW', 'INVESTIGATING', 'DISMISSED', 'RESOLVED');

-- AlterTable
ALTER TABLE "fraud_alerts"
ADD COLUMN     "status" "FraudAlertStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "statusUpdatedByUserId" TEXT,
ADD COLUMN     "dismissReason" TEXT;

-- CreateIndex
CREATE INDEX "fraud_alerts_status_idx" ON "fraud_alerts"("status");

-- AddForeignKey
ALTER TABLE "fraud_alerts" ADD CONSTRAINT "fraud_alerts_statusUpdatedByUserId_fkey" FOREIGN KEY ("statusUpdatedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

