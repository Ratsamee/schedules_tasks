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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

taskRouter.get('/schedule/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { skip = '0', take = '10' } = req.query
        const schedules = await taskService.getTasks({ scheduleId: id.toString(), skip: Number(skip), take: Number(take) })
        return res.status(StatusCodes.OK).json(schedules)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});
