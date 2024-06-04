import { SearchTasksCriteria, Task } from "../../entities/task/task.entity";
import ITaskService from "./task.interface"
import TaskRepository from '../../repositories/tasks/task'

const repository = new TaskRepository()
class TaskService implements ITaskService {
    async getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]> {
        const schedules = await repository.getTasks(searchCriteria)
        return schedules
    }
}

export default TaskService