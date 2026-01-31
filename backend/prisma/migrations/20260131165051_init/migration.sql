-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completedBy" INTEGER,
ADD COLUMN     "startedAt" TIMESTAMP(3);
