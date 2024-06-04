import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { SearchScheduleCriteria, Schedule, ScheduleSearchResult, ScheduleInput, ScheduleUpdateResult } from "../../entities/schedule/schedule.entity";
import ScheduleInputValidator from '../../entities/schedule/ScheduleInputValidator'
import IScheduleService from "./schedule.interface";
import ScheduleRepository from '../../repositories/schedules/schedule'

const repository = new ScheduleRepository()
class ScheduleService implements IScheduleService {
    async getSchedules(searchCriteria: SearchScheduleCriteria): Promise<Schedule[]> {
        const schedules = await repository.getSchedules(searchCriteria)
        return schedules
    }
    async getSchedule(id: string): Promise<ScheduleSearchResult> {
        if (id.trim().length === 0) {
            return { status: 'SCHEDULE_ID_INVALID', errorMessage: 'schedule id is invalid' }
        }
        // const repository = new ScheduleRepository()
        const schedule = await repository.getSchedule(id)
        if (!schedule) {
            return { status: 'SCHEDULE_NOT_EXIST', errorMessage: `schedule doesn't exist` }
        }
        return { status: "SUCCESS", schedule }
    }
    async createSchedule(data: ScheduleInput): Promise<ScheduleUpdateResult> {
        const { accountId, agentId, startTime, endTime } = data
        const id = uuid()
        const scheduleInputValidator = new ScheduleInputValidator(id, accountId, agentId, startTime, endTime);
        const { errorMessage } = scheduleInputValidator.validateData();
        if (errorMessage) {
            return { status: 'INVALID_DATA', errorMessage }
        }
        const scheduleInput = {
            id,
            accountId,
            agentId,
            startTime: moment(startTime, 'YYYY-MM-DDTHH:mm:ssZ').utc().toDate(),
            endTime: moment(endTime, 'YYYY-MM-DDTHH:mm:ssZ').utc().toDate()
        }
        const schedule = await repository.createSchedule(scheduleInput)
        return { status: 'SUCCESS', schedule };
    }
    async updateSchedule(data: Schedule): Promise<ScheduleUpdateResult> {
        const { id, accountId, agentId, startTime, endTime } = data
        const scheduleInputValidator = new ScheduleInputValidator(id, accountId, agentId, startTime, endTime);
        const { errorMessage } = scheduleInputValidator.validateData();
        if (errorMessage) {
            return { status: 'INVALID_DATA', errorMessage }
        }
        const scheduleInput: Schedule = {
            id,
            accountId,
            agentId,
            startTime: moment(startTime, 'YYYY-MM-DDTHH:mm:ssZ').utc().toDate(),
            endTime: moment(endTime, 'YYYY-MM-DDTHH:mm:ssZ').utc().toDate()
        }
        const existSchedule = await repository.getSchedule(id);
        if (!existSchedule) {
            return { status: 'SCHEDULE_NOT_EXIST', errorMessage: `schedule doesn't exist` }
        }
        const schedule = await repository.updateSchedule(scheduleInput)
        return { status: 'SUCCESS', schedule }
    }
}

export default ScheduleService