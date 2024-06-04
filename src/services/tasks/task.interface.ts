import { Task, TaskInput, SearchTasksCriteria } from '../../entities/task/task.entity'

export default interface ITaskService {
    getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]>
}