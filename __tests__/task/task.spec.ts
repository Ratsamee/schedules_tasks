import { TaskService } from '../../src/services'
import { prismaMock } from '../__mocks__/singleton'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { TaskType } from '@prisma/client'
import { Task, TaskInput } from '../../src/entities/task/task.entity'

const taskService = new TaskService()
describe('getTasks', () => {
    it('should get empty task', async () => {
        prismaMock.tasks.findMany.mockResolvedValue([])
        const result = await taskService.getTasks({})
        expect(result).toEqual([])
    })
    it('should return tasks after filter', async () => {
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
    it('should return task is not found', async () => {
        prismaMock.tasks.findUnique.mockResolvedValue(null)
        const expectResult = { status: 'TASK_NOT_EXIST', errorMessage: `task doesn't exist` }
        const result = await taskService.getTask('1548')
        expect(result).toEqual(expectResult)
    })
    it('should return task', async () => {
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

describe('CreateTask', () => {
    it('should return invalidate data once type is "ENJOY"', async () => {
        const task: TaskInput = {
            accountId: 1,
            scheduleId: uuid(),
            startTime: moment().utc().toDate(),
            duration: 30,
            // @ts-ignore
            type: 'ENJOY'
        }
        const result = await taskService.createTask(task)
        const expectedResult = { status: 'INVALID_DATA', errorMessage: "\"type\" must be one of [BREAK, WORK]" }
        expect(result).toEqual(expectedResult)
    })
    it('should return schedule does not exist', async () => {
        const task: TaskInput = {
            accountId: 1,
            scheduleId: uuid(),
            startTime: moment().utc().toDate(),
            duration: 30,
            type: 'WORK'
        }
        prismaMock.schedule.findUnique.mockResolvedValue(null)
        const result = await taskService.createTask(task)
        const expectedResult = { status: 'SCHEDULE_NOT_EXIST', errorMessage: 'schedule does not exist, invalid data' }
        expect(result).toEqual(expectedResult)
    })
    it('should return success', async () => {
        const scheduleId = uuid()
        const schedule = {
            id: scheduleId,
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        prismaMock.schedule.findUnique.mockResolvedValue(schedule)
        const taskInput: TaskInput = {
            accountId: 1,
            scheduleId,
            startTime: moment().utc().toDate(),
            duration: 30,
            type: 'WORK'
        }
        const task = {
            id: uuid(),
            accountId: 1,
            scheduleId,
            startTime: moment().utc().toDate(),
            duration: 30,
            type: 'WORK'
        }
        prismaMock.tasks.create.mockResolvedValue({ ...task, type: TaskType.WORK })
        const result = await taskService.createTask(taskInput)
        const expectedResult = { status: 'SUCCESS', task }
        expect(result).toEqual(expectedResult)
    })
})

describe('UpdateTask', () => {
    it('should return invalid data hence id is missing', async () => {
        // @ts-ignore
        const task: Task = {
            accountId: 1,
            scheduleId: uuid(),
            startTime: moment().utc().toDate(),
            duration: 30,
            type: 'WORK'
        }
        const result = await taskService.updateTask(task)
        const expectedResult = { status: 'INVALID_DATA', errorMessage: "\"id\" is required" }
        expect(result).toEqual(expectedResult)
    })
    it('should return task does not exist', async () => {
        const task: Task = {
            id: uuid(),
            accountId: 1,
            scheduleId: uuid(),
            startTime: moment().utc().toDate(),
            duration: 30,
            type: 'WORK'
        }
        prismaMock.tasks.findUnique.mockResolvedValue(null)
        const result = await taskService.updateTask(task)
        const expectedResult = { status: 'TASK_NOT_EXIST', errorMessage: 'task does not exist' }
        expect(result).toEqual(expectedResult)
    })
    it('should return schedule does not exist', async () => {
        const task: Task = {
            id: uuid(),
            accountId: 1,
            scheduleId: uuid(),
            startTime: moment().utc().toDate(),
            duration: 30,
            type: 'WORK'
        }
        prismaMock.tasks.findUnique.mockResolvedValue(task)
        prismaMock.schedule.findUnique.mockResolvedValue(null)
        const result = await taskService.updateTask(task)
        const expectedResult = { status: 'SCHEDULE_NOT_EXIST', errorMessage: 'schedule does not exist, invalid data' }
        expect(result).toEqual(expectedResult)
    })
    it('should return success', async () => {
        const scheduleId = uuid()
        const task: Task = {
            id: uuid(),
            accountId: 1,
            scheduleId,
            startTime: moment().utc().toDate(),
            duration: 30,
            type: 'WORK'
        }
        const schedule = {
            id: scheduleId,
            accountId: 2,
            agentId: 102,
            startTime: moment().utc().toDate(),
            endTime: moment().utc().add(1, 'd').toDate()
        }
        const updatedTask = { ...task, duration: 10 }
        prismaMock.tasks.findUnique.mockResolvedValue(task)
        prismaMock.tasks.update.mockResolvedValue(updatedTask)
        prismaMock.schedule.findUnique.mockResolvedValue(schedule)

        const result = await taskService.updateTask(updatedTask)
        const expectedResult = { status: 'SUCCESS', task: updatedTask }
        expect(result).toEqual(expectedResult)
    })

})

describe('delete task', () => {
    describe('delete single task', () => {
        it('should return invalid data', async () => {
            const result = await taskService.deleteTask('32355')
            const expectedResult = { status: 'TASK_ID_INVALID', errorMessage: 'task id is invalid' }
            expect(result).toEqual(expectedResult)
        })
        it('should return task does not exist', async () => {
            prismaMock.tasks.findUnique.mockResolvedValue(null)
            const result = await taskService.deleteTask(uuid())
            const expectedResult = { status: 'TASK_NOT_EXIST', errorMessage: `task doesn't exist` }
            expect(result).toEqual(expectedResult)
        })
        it('should return delete id', async () => {
            const task = {
                id: uuid(),
                accountId: 1,
                scheduleId: uuid(),
                startTime: moment().utc().toDate(),
                duration: 30,
                type: TaskType.BREAK
            }
            prismaMock.tasks.findUnique.mockResolvedValue(task)
            prismaMock.tasks.delete.mockResolvedValue(task)
            const result = await taskService.deleteTask(task.id)
            const expectedResult = { status: 'SUCCESS', deleteTaskIds: [task.id] }
            expect(result).toEqual(expectedResult)
        })
    })
    describe('delete bulk tasks', () => {
        it('should return invalid data', async () => {
            const ids = ['434335', '656t6y']
            const result = await taskService.deleteTasks(ids)
            const expectedResult = { status: 'TASK_NOT_EXIST', errorMessage: `there is no tasks exist all list` }
            expect(result).toEqual(expectedResult)
        })
        it('should delete all tasks', async () => {
            const oneId = uuid()
            const twoId = uuid()
            const ids = [oneId, twoId]
            const taskOne = {
                id: oneId,
                accountId: 1,
                scheduleId: uuid(),
                startTime: moment().utc().toDate(),
                duration: 30,
                type: TaskType.BREAK
            }
            const taskTwo = {
                id: twoId,
                accountId: 1,
                scheduleId: uuid(),
                startTime: moment().utc().toDate(),
                duration: 30,
                type: TaskType.BREAK
            }
            prismaMock.tasks.findUnique.mockResolvedValueOnce(taskOne)
            prismaMock.tasks.findUnique.mockResolvedValueOnce(taskTwo)
            prismaMock.tasks.delete.mockResolvedValueOnce(taskOne)
            prismaMock.tasks.delete.mockResolvedValueOnce(taskTwo)
            prismaMock.$transaction.mockResolvedValue([taskOne, taskTwo])
            const result = await taskService.deleteTasks(ids)
            const expectedResult = { status: 'SUCCESS', deleteTaskIds: ids }
            expect(result).toEqual(expectedResult)
        })
    })
})