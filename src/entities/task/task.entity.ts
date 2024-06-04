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

export interface TaskSearchResult {
    status: 'SUCCESS' | 'TASK_NOT_EXIST' | 'TASK_ID_INVALID',
    errorMessage?: string,
    task?: Task
}