import Schedule from "../../entities/schedule/Schedule";
import { SearchScheduleCriteria } from "../../entities/schedule/schedule.entity";
import IScheduleRepository from "./schedule.interface";
import prisma from '../client'

class ScheduleRepository implements IScheduleRepository {
    async getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]> {
        const { accountId, agentId, skip, take } = searchCriteria || {};
        const schedules = await prisma.schedule.findMany({
            skip,
            take,
            where: { accountId, agentId }
        })
        return schedules
    }
}

export default ScheduleRepository