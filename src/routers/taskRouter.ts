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

export default taskRouter