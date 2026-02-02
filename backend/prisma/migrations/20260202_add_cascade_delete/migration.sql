-- Drop existing foreign key constraints
ALTER TABLE "Task" DROP CONSTRAINT "Task_roomId_fkey";
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_roomId_fkey";
ALTER TABLE "TaskDependency" DROP CONSTRAINT "TaskDependency_taskId_fkey";
ALTER TABLE "TaskDependency" DROP CONSTRAINT "TaskDependency_dependsOnTaskId_fkey";
-- Add back with CASCADE delete rules
ALTER TABLE "Task"
ADD CONSTRAINT "Task_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoomMember"
ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskDependency"
ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskDependency"
ADD CONSTRAINT "TaskDependency_dependsOnTaskId_fkey" FOREIGN KEY ("dependsOnTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;