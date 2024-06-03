"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Schedule {
    constructor(id, accountId, agentId, startTime, endTime) {
        this.id = id;
        this.accountId = accountId;
        this.agentId = agentId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
exports.default = Schedule;
