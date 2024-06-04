import { Task, TaskInput, SearchTasksCriteria, TaskSearchResult, TaskUpsertResult } from '../../entities/task/task.entity'

export default interface ITaskService {
    getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]>
    getTask(id: string): Promise<TaskSearchResult>
    createTask(taskInput: TaskInput): Promise<TaskUpsertResult>
    updateTask(task: Task): Promise<TaskUpsertResult>
}