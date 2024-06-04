import { Prisma } from '@prisma/client'
import moment from 'moment'
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
    async createSchedule(data: Schedule): Promise<Schedule> {
        const { id, accountId, agentId, startTime, endTime } = data;
        const scheduleData: Prisma.ScheduleCreateInput = {
            id,
            accountId: accountId,
            agentId: agentId,
            startTime: moment(startTime).utc().toISOString(),
            endTime: moment(endTime).utc().toISOString()
        }
        const result = await prisma.schedule.create({ data: scheduleData })
        return result;
    }
    async updateSchedule(data: Schedule): Promise<Schedule> {
        const { id, accountId, agentId, startTime, endTime } = data;
        const result = await prisma.schedule.update({
            where: { id },
            data: {
                accountId,
                agentId,
                startTime,
                endTime
            }
        })
        return result;
    }
    async deleteSchedule(id: string): Promise<boolean> {
        const deleteTasks = prisma.tasks.deleteMany({
            where: {
                scheduleId: id
            }
        })
        const deleteSchedule = prisma.schedule.delete({
            where: {
                id
            }
        })
        await prisma.$transaction([deleteTasks, deleteSchedule])
        return true
    }
}

export default ScheduleRepository