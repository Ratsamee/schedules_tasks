import { SearchScheduleCriteria, Schedule } from "../../entities/schedule/schedule.entity"
import { Task } from '../../entities/task/task.entity'

export default interface IScheduleRepository {
    getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]>
    getSchedule(id: string): Promise<Schedule | null>
    createSchedule(data: Schedule): Promise<Schedule>
    updateSchedule(data: Schedule): Promise<Schedule>
    deleteSchedule(id: string): Promise<boolean>
}