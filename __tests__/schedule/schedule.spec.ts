import { ScheduleService } from '../../src/services'
import { prismaMock } from '../__mocks__/singleton'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { Prisma, TaskType } from '@prisma/client'

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
    it('should return schedule is invalid hence input is undefined', async () => {
        // @ts-ignore
        const result = await scheduleService.getSchedule()
        const expectResult = { status: 'SCHEDULE_ID_INVALID', errorMessage: 'schedule id is invalid' }
        expect(result).toEqual(expectResult)
    })
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

describe('createSchedule', () => {
    it('should return invalidate data', async () => {
        const schedule = {
            id: uuid(),
            accountId: 2,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        // @ts-ignore
        const result = await scheduleService.createSchedule(schedule)
        const expectedResult = { status: 'INVALID_DATA', errorMessage: "\"agentId\" is required" }
        expect(result).toEqual(expectedResult)
    })
    it('should return schedule once create success', async () => {
        const schedule = {
            id: uuid(),
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        prismaMock.schedule.create.mockResolvedValue(schedule)
        const result = await scheduleService.createSchedule(schedule)
        expect(result).toEqual({ status: 'SUCCESS', schedule })
    })
})

describe('updateSchedule', () => {
    it('should return invalidate data', async () => {
        const schedule = {
            id: uuid(),
            accountId: 2,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        // @ts-ignore
        const result = await scheduleService.updateSchedule(schedule)
        const expectedResult = { status: 'INVALID_DATA', errorMessage: "\"agentId\" is required" }
        expect(result).toEqual(expectedResult)
    })
    it('should return schedule does not exist', async () => {
        prismaMock.schedule.findUnique.mockResolvedValue(null)
        const schedule = {
            id: uuid(),
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        const result = await scheduleService.updateSchedule(schedule)
        const expectResult = { status: 'SCHEDULE_NOT_EXIST', errorMessage: `schedule doesn't exist` }
        expect(result).toEqual(expectResult)
    })
    it('should return success', async () => {
        const schedule = {
            id: uuid(),
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        prismaMock.schedule.findUnique.mockResolvedValue(schedule)
        const updatedSchedule = { ...schedule, agentId: 103 }
        prismaMock.schedule.update.mockResolvedValue(schedule)
        const expectedResult = { status: 'SUCCESS', schedule }
        const result = await scheduleService.updateSchedule(updatedSchedule);
        expect(result).toEqual(expectedResult);
    })
})

describe('delete schedule', () => {
    it('should return invalidate data once id = undefined', async () => {
        // @ts-ignore
        const result = await scheduleService.deleteSchedule()
        const expectedResult = { status: 'INVALID_DATA', errorMessage: "schedule id is invalid" }
        expect(result).toEqual(expectedResult)
    })
    it('should return schedule does not exist', async () => {
        prismaMock.schedule.findUnique.mockResolvedValue(null)
        const result = await scheduleService.deleteSchedule('eewewe')
        const expectResult = { status: 'SCHEDULE_NOT_EXIST', errorMessage: `schedule doesn't exist` }
        expect(result).toEqual(expectResult)
    })
    it('should delete schedule', async () => {
        prismaMock.$transaction.mockResolvedValue([])
        const scheduleId = uuid()
        const schedule = {
            id: scheduleId,
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }

        prismaMock.tasks.deleteMany.mockResolvedValue({ count: 2 } as Prisma.BatchPayload)
        prismaMock.schedule.delete.mockResolvedValue(schedule)
        prismaMock.schedule.findUnique.mockResolvedValue(schedule)
        const result = await scheduleService.deleteSchedule(scheduleId)

        expect(result).toEqual({ status: 'SUCCESS' })
        expect(prismaMock.tasks.deleteMany).toHaveBeenCalled()
        expect(prismaMock.schedule.delete).toHaveBeenCalled()
        expect(prismaMock.$transaction).toHaveBeenCalled()
    })
})