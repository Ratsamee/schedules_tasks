import { Task, TaskInput, SearchTasksCriteria } from '../../entities/task/task.entity'

export default interface ITaskRepository {
    getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]>
}