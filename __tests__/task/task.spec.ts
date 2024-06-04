import { TaskService } from '../../src/services'
import { prismaMock } from '../__mocks__/singleton'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { TaskType } from '@prisma/client'

const taskService = new TaskService()
describe('getTasks', () => {
    it('should get empty schedules', async () => {
        prismaMock.tasks.findMany.mockResolvedValue([])
        const result = await taskService.getTasks({})
        expect(result).toEqual([])
    })
    it('should return schedule after filter', async () => {
        const task = {
            id: uuid(),
            accountId: 2,
            scheduleId: uuid(),
            startTime: moment().utc().toDate(),
            duration: 30,
            type: TaskType.BREAK
        }
        const searchCriteria = {
            accountId: 3,
            agentId: 102,
            skip: 0,
            take: 1
        }
        prismaMock.tasks.findMany.mockResolvedValue([task])
        const result = await taskService.getTasks(searchCriteria)
        expect(result).toEqual([task])
    })
});