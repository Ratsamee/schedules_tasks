import Schedule from "../../entities/schedule/Schedule";
import { SearchScheduleCriteria } from "../../entities/schedule/schedule.entity";
import IScheduleService from "./schedule.interface";
import ScheduleRepository from '../../repositories/schedules/schedule'

class ScheduleService implements IScheduleService {

    async getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]> {
        const repository = new ScheduleRepository()
        const schedules = await repository.getSchedules(searchCriteria)
        return schedules
    }

}

export default ScheduleService