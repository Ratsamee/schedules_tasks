import { SearchScheduleCriteria, Schedule, ScheduleSearchResult, ScheduleInput, ScheduleUpdateResult } from "../../entities/schedule/schedule.entity";

export default interface IScheduleService {
    getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]>
    getSchedule(id: string): Promise<ScheduleSearchResult>
    createSchedule(data: ScheduleInput): Promise<ScheduleUpdateResult>
    updateSchedule(data: Schedule): Promise<ScheduleUpdateResult>
    deleteSchedule(id: string): Promise<ScheduleUpdateResult>
}