import { Task, TaskInput, SearchTasksCriteria, TaskSearchResult } from '../../entities/task/task.entity'

export default interface ITaskService {
    getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]>
    getTask(id: string): Promise<TaskSearchResult>
}