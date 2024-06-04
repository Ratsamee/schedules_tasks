import { SearchTasksCriteria, Task, TaskSearchResult } from "../../entities/task/task.entity";
import ITaskService from "./task.interface"
import TaskRepository from '../../repositories/tasks/task'

const repository = new TaskRepository()
class TaskService implements ITaskService {

    async getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]> {
        const tasks = await repository.getTasks(searchCriteria)
        return tasks
    }
    async getTask(id: string): Promise<TaskSearchResult> {
        if (!id || id.trim().length === 0) {
            return { status: 'TASK_ID_INVALID', errorMessage: 'task id is invalid' }
        }
        // const repository = new ScheduleRepository()
        const task = await repository.getTask(id)
        if (!task) {
            return { status: 'TASK_NOT_EXIST', errorMessage: `task doesn't exist` }
        }
        return { status: "SUCCESS", task }
    }
}

export default TaskService