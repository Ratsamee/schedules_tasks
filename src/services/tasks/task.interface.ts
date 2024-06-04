import { Task, TaskInput, SearchTasksCriteria, TaskSearchResult, TaskUpsertResult, TaskDeleteResult } from '../../entities/task/task.entity'

export default interface ITaskService {
    getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]>
    getTask(id: string): Promise<TaskSearchResult>
    createTask(taskInput: TaskInput): Promise<TaskUpsertResult>
    updateTask(task: Task): Promise<TaskUpsertResult>
    deleteTask(id: string): Promise<TaskDeleteResult>
    deleteTasks(ids: string[]): Promise<TaskDeleteResult>
}