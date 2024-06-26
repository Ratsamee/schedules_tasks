export type TaskType = 'BREAK' | 'WORK'

export type SearchTasksCriteria = {
    accountId?: number,
    scheduleId?: string,
    skip?: number,
    take?: number
}

export interface TaskInput {
    accountId: number,
    scheduleId: string,
    startTime: Date,
    duration: number,
    type: TaskType
}

export interface Task extends TaskInput {
    id: string
}

export type TaskSearchResult = {
    status: 'SUCCESS' | 'TASK_NOT_EXIST' | 'TASK_ID_INVALID',
    errorMessage?: string,
    task?: Task
}

export type TaskUpsertResult = {
    status: 'SUCCESS' | 'SCHEDULE_NOT_EXIST' | 'TASK_NOT_EXIST' | 'INVALID_DATA',
    errorMessage?: string,
    task?: Task
}

export type TaskDeleteResult = {
    status: 'SUCCESS' | 'TASK_NOT_EXIST' | 'TASK_ID_INVALID',
    errorMessage?: string,
    deleteTaskIds?: string[]
}