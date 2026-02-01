-- Add missing fields to Room
ALTER TABLE "Room" ADD COLUMN "description" TEXT;

-- Add missing fields to Task
ALTER TABLE "Task" ADD COLUMN "description" TEXT;
ALTER TABLE "Task" ADD COLUMN "dueDate" TIMESTAMP(3);
ALTER TABLE "Task" ADD COLUMN "rejectedAt" TIMESTAMP(3);
ALTER TABLE "Task" ADD COLUMN "rejectionNote" TEXT;
