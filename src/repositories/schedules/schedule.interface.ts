import Schedule from "../../entities/schedule/Schedule";
import { SearchScheduleCriteria } from "../../entities/schedule/schedule.entity";

export default interface IScheduleRepository {
    getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]>;
}