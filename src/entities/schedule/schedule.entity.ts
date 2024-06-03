export type SearchScheduleCriteria = {
    accountId?: number,
    agentId?: number,
    skip?: number,
    take?: number
}

export interface Schedule {
    id: string,
    accountId: number,
    agentId: number,
    startTime: Date,
    endTime: Date,
}
export interface ScheduleSearchResult {
    status: 'SUCCESS' | 'SCHEDULE_NOT_EXIST' | 'SCHEDULE_ID_INVALID',
    errorMessage?: string,
    schedule?: Schedule
}