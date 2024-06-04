import { Router, Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { TaskService } from '../services'

const taskRouter = Router()
const taskService = new TaskService()

taskRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { accountid = '', scheduleid = '', skip = '0', take = '10' } = req.query
        const accountId = accountid === '' ? undefined : Number(accountid)
        const scheduleId = scheduleid === '' ? undefined : scheduleid.toString()
        const schedules = await taskService.getTasks({ accountId, scheduleId, skip: Number(skip), take: Number(take) })
        return res.status(StatusCodes.OK).json(schedules)
    } catch (error) {
        console.log('error', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

taskRouter.get('/schedules/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { skip = '0', take = '10' } = req.query
        const tasks = await taskService.getTasks({ scheduleId: id.toString(), skip: Number(skip), take: Number(take) })
        return res.status(StatusCodes.OK).json(tasks)
    } catch (error) {
        console.log('error', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});
taskRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const taskResult = await taskService.getTask(id)
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'TASK_ID_INVALID': StatusCodes.BAD_REQUEST,
            'TASK_NOT_EXIST': StatusCodes.NOT_FOUND
        }
        const statusCode = statusCodeLibs[taskResult.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: taskResult.errorMessage })
        }
        res.status(StatusCodes.OK).json(taskResult.task)
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

taskRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { accountId, scheduleId, startTime, duration, type } = req.body
        const taskResult = await taskService.createTask({ accountId, scheduleId, startTime, duration, type });
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'SCHEDULE_NOT_EXIST': StatusCodes.NOT_FOUND,
            'INVALID_DATA': StatusCodes.BAD_REQUEST,
            'TASK_NOT_EXIST': StatusCodes.INTERNAL_SERVER_ERROR
        }
        const statusCode = statusCodeLibs[taskResult.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: taskResult.errorMessage })
        }
        res.status(StatusCodes.CREATED).json(taskResult.task)
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

taskRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { accountId, scheduleId, startTime, duration, type } = req.body
        const taskResult = await taskService.updateTask({ id, accountId, scheduleId, startTime, duration, type });
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'SCHEDULE_NOT_EXIST': StatusCodes.NOT_FOUND,
            'INVALID_DATA': StatusCodes.BAD_REQUEST,
            'TASK_NOT_EXIST': StatusCodes.NOT_FOUND
        }
        const statusCode = statusCodeLibs[taskResult.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: taskResult.errorMessage })
        }
        res.status(StatusCodes.OK).json(taskResult.task)
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

taskRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedTaskResult = await taskService.deleteTask(id);
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'TASK_ID_INVALID': StatusCodes.BAD_REQUEST,
            'TASK_NOT_EXIST': StatusCodes.NOT_FOUND
        }
        const statusCode = statusCodeLibs[deletedTaskResult.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: deletedTaskResult.errorMessage })
        }
        res.status(StatusCodes.OK).json({ deletedTaskId: deletedTaskResult.deleteTaskIds })
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

taskRouter.delete('/', async (req: Request, res: Response) => {
    try {
        const { taskIds } = req.body;
        const deletedTaskIds = await taskService.deleteTasks(taskIds);
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'TASK_ID_INVALID': StatusCodes.BAD_REQUEST,
            'TASK_NOT_EXIST': StatusCodes.NOT_FOUND
        }
        const statusCode = statusCodeLibs[deletedTaskIds.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: deletedTaskIds.errorMessage })
        }

        res.status(StatusCodes.OK).json({ deletedTaskIds: deletedTaskIds.deleteTaskIds })
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});
export default taskRouter