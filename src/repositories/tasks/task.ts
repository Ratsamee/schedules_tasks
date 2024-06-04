import { SearchTasksCriteria, Task, TaskInput } from "../../entities/task/task.entity";
import ITaskRepository from "./task.interface";
import prisma from '../client'
import moment from "moment";

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
    async getTask(id: string): Promise<Task | null> {
        const task = await prisma.tasks.findUnique({ where: { id } })
        return task;
    }
    async createTask(taskInput: Task): Promise<Task> {
        const { id, accountId, scheduleId, startTime, duration, type } = taskInput;
        const task = await prisma.tasks.create({
            data: {
                id,
                accountId,
                schedule: {
                    connect: { id: scheduleId }
                },
                startTime: moment(startTime).utc().toISOString(),
                duration,
                type
            }
        })
        return task;
    }
}

export default TaskRepository