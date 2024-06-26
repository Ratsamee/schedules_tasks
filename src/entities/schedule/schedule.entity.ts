
export type SearchScheduleCriteria = {
    accountId?: number,
    agentId?: number,
    skip?: number,
    take?: number
}

export interface ScheduleInput {
    accountId: number,
    agentId: number,
    startTime: Date,
    endTime: Date,
}

export interface Schedule extends ScheduleInput {
    id: string
}

export interface ScheduleSearchResult {
    status: 'SUCCESS' | 'SCHEDULE_NOT_EXIST' | 'SCHEDULE_ID_INVALID',
    errorMessage?: string,
    schedule?: Schedule
}

export interface ScheduleUpdateResult {
    status: 'SUCCESS' | 'SCHEDULE_NOT_EXIST' | 'INVALID_DATA',
    errorMessage?: string,
    schedule?: Schedule
}
