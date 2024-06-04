import { SearchScheduleCriteria, Schedule } from "../../entities/schedule/schedule.entity"

export default interface IScheduleRepository {
    getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]>
    getSchedule(id: string): Promise<Schedule | null>
    createSchedule(data: Schedule): Promise<Schedule>
    updateSchedule(data: Schedule): Promise<Schedule>
}