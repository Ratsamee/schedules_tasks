import { ScheduleService } from '../../src/services'
import { prismaMock } from '../__mocks__/singleton'
import { v4 as uuid } from 'uuid'
import moment from 'moment'

const scheduleService = new ScheduleService()
describe('getSchedules', () => {
    it('should get empty schedules', async () => {
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

describe('getSchedule', () => {
    it('should return schedule is invalid hence input is empty string', async () => {
        const result = await scheduleService.getSchedule('')
        const expectResult = { status: 'SCHEDULE_ID_INVALID', errorMessage: 'schedule id is invalid' }
        expect(result).toEqual(expectResult)
    })
    it('should return schedule is not found', async () => {
        prismaMock.schedule.findUnique.mockResolvedValue(null)
        const expectResult = { status: 'SCHEDULE_NOT_EXIST', errorMessage: `schedule doesn't exist` }
        const result = await scheduleService.getSchedule('1548')
        expect(result).toEqual(expectResult)
    })
    it('should return schedule', async () => {
        const schedule = {
            id: uuid(),
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        prismaMock.schedule.findUnique.mockResolvedValue(schedule)
        const expectResult = { status: 'SUCCESS', schedule }
        const result = await scheduleService.getSchedule('1548')
        expect(result).toEqual(expectResult)
    })
})