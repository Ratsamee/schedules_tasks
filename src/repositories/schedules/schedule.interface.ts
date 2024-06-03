import { SearchScheduleCriteria, Schedule } from "../../entities/schedule/schedule.entity"

export default interface IScheduleRepository {
    getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]>
    getSchedule(id: string): Promise<Schedule | null>
}