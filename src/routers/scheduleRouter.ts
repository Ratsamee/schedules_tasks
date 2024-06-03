import { Router, Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { ScheduleService } from '../services'

const scheduleRouter = Router();

scheduleRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { accountid = '', agentid = '', skip = '0', take = '10' } = req.query
        const accountId = accountid === '' ? undefined : Number(accountid)
        const agentId = agentid === '' ? undefined : Number(agentid)
        const scheduleServices = new ScheduleService()
        const schedules = await scheduleServices.getSchedules({ accountId, agentId, skip: Number(skip), take: Number(take) })
        return res.status(StatusCodes.OK).json(schedules)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

export default scheduleRouter