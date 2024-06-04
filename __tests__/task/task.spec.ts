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

describe('get Task', () => {
    it('should return task is invalid hence input is undefined', async () => {
        // @ts-ignore
        const result = await taskService.getTask()
        const expectResult = { status: 'TASK_ID_INVALID', errorMessage: 'task id is invalid' }
        expect(result).toEqual(expectResult)
    })
    it('should return task is invalid hence input is empty string', async () => {
        const result = await taskService.getTask('')
        const expectResult = { status: 'TASK_ID_INVALID', errorMessage: 'task id is invalid' }
        expect(result).toEqual(expectResult)
    })
    it('should return schedule is not found', async () => {
        prismaMock.schedule.findUnique.mockResolvedValue(null)
        const expectResult = { status: 'TASK_NOT_EXIST', errorMessage: `task doesn't exist` }
        const result = await taskService.getTask('1548')
        expect(result).toEqual(expectResult)
    })
    it('should return schedule', async () => {
        const taskId = uuid()
        const task = {
            id: taskId,
            accountId: 2,
            scheduleId: uuid(),
            startTime: moment().utc().toDate(),
            duration: 30,
            type: TaskType.BREAK
        }
        prismaMock.tasks.findUnique.mockResolvedValue(task)
        const expectResult = { status: 'SUCCESS', task }
        const result = await taskService.getTask(taskId)
        expect(result).toEqual(expectResult)
    })
})