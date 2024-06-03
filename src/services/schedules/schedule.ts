import { SearchScheduleCriteria, Schedule, ScheduleSearchResult } from "../../entities/schedule/schedule.entity";
import IScheduleService from "./schedule.interface";
import ScheduleRepository from '../../repositories/schedules/schedule'

class ScheduleService implements IScheduleService {
    async getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]> {
        const repository = new ScheduleRepository()
        const schedules = await repository.getSchedules(searchCriteria)
        return schedules
    }
    async getSchedule(id: string): Promise<ScheduleSearchResult> {
        if (id.trim().length === 0) {
            return { status: 'SCHEDULE_ID_INVALID', errorMessage: 'schedule id is invalid' }
        }
        const repository = new ScheduleRepository()
        const schedule = await repository.getSchedule(id)
        if (!schedule) {
            return { status: 'SCHEDULE_NOT_EXIST', errorMessage: `schedule doesn't exist` }
        }
        return { status: "SUCCESS", schedule }
    }
}

export default ScheduleService