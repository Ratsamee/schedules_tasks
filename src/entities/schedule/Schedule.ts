import JobBaseInterface from "../JobBase.interface";

class Schedule implements JobBaseInterface {
    id: string;
    accountId: number;
    agentId: number;
    startTime: Date;
    endTime: Date;
    constructor(id: string, accountId: number, agentId: number, startTime: Date, endTime: Date) {
        this.id = id;
        this.accountId = accountId;
        this.agentId = agentId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

export default Schedule;