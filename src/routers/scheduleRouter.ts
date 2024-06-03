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

scheduleRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const scheduleServices = new ScheduleService()
        const scheduleResult = await scheduleServices.getSchedule(id)
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'SCHEDULE_ID_INVALID': StatusCodes.BAD_REQUEST,
            'SCHEDULE_NOT_EXIST': StatusCodes.NOT_FOUND
        }
        const statusCode = statusCodeLibs[scheduleResult.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: scheduleResult.errorMessage })
        }
        res.status(StatusCodes.OK).json(scheduleResult.schedule)
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

export default scheduleRouter