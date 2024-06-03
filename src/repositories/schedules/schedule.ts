import { SearchScheduleCriteria, Schedule } from "../../entities/schedule/schedule.entity";
import IScheduleRepository from "./schedule.interface";
import prisma from '../client'

class ScheduleRepository implements IScheduleRepository {
    async getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]> {
        const { accountId, agentId, skip, take } = searchCriteria;
        const schedules = await prisma.schedule.findMany({
            skip,
            take,
            where: { accountId, agentId }
        })
        return schedules
    }
    async getSchedule(id: string): Promise<Schedule | null> {
        const schedule = await prisma.schedule.findUnique({ where: { id } })
        return schedule
    }
}

export default ScheduleRepository