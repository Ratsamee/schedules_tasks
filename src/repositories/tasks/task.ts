import { SearchTasksCriteria, Task } from "../../entities/task/task.entity";
import ITaskRepository from "./task.interface";
import prisma from '../client'

class TaskRepository implements ITaskRepository {
    async getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]> {
        const { accountId, scheduleId, skip, take } = searchCriteria;
        const tasks = await prisma.tasks.findMany({
            skip,
            take,
            where: { accountId, scheduleId }
        })

        return tasks
    }
}

export default TaskRepository