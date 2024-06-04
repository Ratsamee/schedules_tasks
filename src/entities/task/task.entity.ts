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