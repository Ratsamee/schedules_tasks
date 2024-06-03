import { SearchScheduleCriteria, Schedule, ScheduleSearchResult } from "../../entities/schedule/schedule.entity";

export default interface IScheduleService {
    getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]>
    getSchedule(id: string): Promise<ScheduleSearchResult>
}