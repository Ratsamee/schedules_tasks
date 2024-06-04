import { Task, TaskInput, SearchTasksCriteria } from '../../entities/task/task.entity'

export default interface ITaskRepository {
    getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]>
    getTask(id: string): Promise<Task | null>
    createTask(task: Task): Promise<Task>
    updateTask(task: Task): Promise<Task>
    deleteTask(id: string): Promise<boolean>
    deleteTasks(ids: string[]): Promise<string[]>
}