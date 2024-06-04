import IJobBase, { ValidateResultType } from "../job.interface"
import Joi from 'joi'

class TaskInputValidator implements IJobBase {
    id: string;
    accountId: number;
    scheduleId: string;
    startTime: Date;
    duration: number;
    type: string
    constructor(id: string, accountId: number, scheduleId: string, startTime: Date, duration: number, type: string) {
        this.id = id
        this.accountId = accountId
        this.scheduleId = scheduleId
        this.startTime = startTime
        this.duration = duration
        this.type = type
    }

    validateData(): ValidateResultType {
        const schema = Joi.object({
            id: Joi.string().required().uuid(),
            accountId: Joi.number().required(),
            scheduleId: Joi.string().required().uuid(),
            startTime: Joi.date().iso().required(),
            duration: Joi.number().required(),
            type: Joi.string().required().valid('BREAK', 'WORK')
        })
        const { id, accountId, scheduleId, startTime, duration, type } = this;
        const { error, value } = schema.validate({ id, accountId, scheduleId, startTime, duration, type })

        return { errorMessage: error?.message, value }
    }
}

export default TaskInputValidator