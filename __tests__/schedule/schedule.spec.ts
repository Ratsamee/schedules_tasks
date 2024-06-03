import { ScheduleService } from '../../src/services'
import { prismaMock } from '../__mocks__/singleton'
import { v4 as uuid } from 'uuid'
import moment from 'moment'

const scheduleService = new ScheduleService()
describe('getSchedules', () => {
    it('should get empty schedules', async () => {
        // prismaMock.prisma.schedule.findMany.mockResolvedValue([])
        prismaMock.schedule.findMany.mockResolvedValue([])
        const result = await scheduleService.getSchedules({})
        expect(result).toEqual([])
    })
    it('should return some schedule', async () => {
        const schedule = {
            id: uuid(),
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        prismaMock.schedule.findMany.mockResolvedValue([schedule])
        const result = await scheduleService.getSchedules({})
        expect(result).toEqual([schedule])
    })
    it('should return schedule after filter', async () => {
        const schedule = {
            id: uuid(),
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        const searchCriteria = {
            accountId: 3,
            agentId: 102,
            skip: 0,
            take: 1
        }
        prismaMock.schedule.findMany.mockResolvedValue([schedule])
        const result = await scheduleService.getSchedules(searchCriteria)
        expect(result).toEqual([schedule])
    })
})