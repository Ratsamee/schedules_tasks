import IJobBase, { ValidateResultType } from "../job.interface"
import Joi from 'joi'

class ScheduleInput implements IJobBase {
    id: string;
    accountId: number;
    agentId: number;
    startTime: Date;
    endTime: Date;
    constructor(id: string, accountId: number, agentId: number, startTime: Date, endTime: Date) {
        this.id = id
        this.accountId = accountId
        this.agentId = agentId
        this.startTime = startTime
        this.endTime = endTime
    }
    validateData(): ValidateResultType {
        const schema = Joi.object({
            id: Joi.string().required().uuid(),
            accountId: Joi.number().required(),
            agentId: Joi.number().required(),
            startTime: Joi.date().iso().required(),
            endTime: Joi.date().iso().required()
        })
        const { id, accountId, agentId, startTime, endTime } = this;
        const { error, value } = schema.validate({ id, accountId, agentId, startTime, endTime })

        return { errorMessage: error?.message, value }
    }
}

export default ScheduleInput