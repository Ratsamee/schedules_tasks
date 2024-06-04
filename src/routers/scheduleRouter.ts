import { Router, Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { ScheduleService } from '../services'

const scheduleRouter = Router()
const scheduleServices = new ScheduleService()

scheduleRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { accountid = '', agentid = '', skip = '0', take = '10' } = req.query
        const accountId = accountid === '' ? undefined : Number(accountid)
        const agentId = agentid === '' ? undefined : Number(agentid)

        const schedules = await scheduleServices.getSchedules({ accountId, agentId, skip: Number(skip), take: Number(take) })
        return res.status(StatusCodes.OK).json(schedules)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

scheduleRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
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

scheduleRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { accountId, agentId, startTime, endTime } = req.body
        const schedule = await scheduleServices.createSchedule({ accountId, agentId, startTime, endTime });
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'SCHEDULE_NOT_EXIST': StatusCodes.NOT_FOUND,
            'INVALID_DATA': StatusCodes.BAD_REQUEST
        }
        const statusCode = statusCodeLibs[schedule.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: schedule.errorMessage })
        }
        res.status(StatusCodes.CREATED).json(schedule.schedule)
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

scheduleRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { accountId, agentId, startTime, endTime } = req.body
        const scheduleInput = { id, accountId, agentId, startTime, endTime }
        const schedule = await scheduleServices.updateSchedule(scheduleInput)
        const statusCodeLibs = {
            'SUCCESS': StatusCodes.OK,
            'SCHEDULE_NOT_EXIST': StatusCodes.NOT_FOUND,
            'INVALID_DATA': StatusCodes.BAD_REQUEST
        }
        const statusCode = statusCodeLibs[schedule.status]
        if (statusCode !== StatusCodes.OK) {
            return res.status(statusCode).json({ error: schedule.errorMessage })
        }
        return res.status(StatusCodes.OK).json(schedule.schedule)
    } catch (error) {
        console.log('error', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
    }
});

export default scheduleRouter