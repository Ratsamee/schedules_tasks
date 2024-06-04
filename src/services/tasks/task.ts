import { SearchTasksCriteria, Task, TaskInput, TaskSearchResult, TaskUpsertResult } from "../../entities/task/task.entity";
import TaskInputValidator from "../../entities/task/taskInputValidator";
import ITaskService from "./task.interface"
import TaskRepository from '../../repositories/tasks/task'
import ScheduleRepository from '../../repositories/schedules/schedule'
import { v4 as uuid } from 'uuid'
import moment from "moment"

const repository = new TaskRepository()
const scheduleRepository = new ScheduleRepository()
class TaskService implements ITaskService {
    async getTasks(searchCriteria: SearchTasksCriteria): Promise<Task[]> {
        const tasks = await repository.getTasks(searchCriteria)
        return tasks
    }
    async getTask(id: string): Promise<TaskSearchResult> {
        if (!id || id.trim().length === 0) {
            return { status: 'TASK_ID_INVALID', errorMessage: 'task id is invalid' }
        }
        const task = await repository.getTask(id)
        if (!task) {
            return { status: 'TASK_NOT_EXIST', errorMessage: `task doesn't exist` }
        }
        return { status: "SUCCESS", task }
    }
    async createTask(taskInput: TaskInput): Promise<TaskUpsertResult> {
        const { accountId, scheduleId, startTime, duration, type } = taskInput
        const id = uuid()
        const scheduleInputValidator = new TaskInputValidator(id, accountId, scheduleId, startTime, duration, type)
        const { errorMessage } = scheduleInputValidator.validateData();
        if (errorMessage) {
            return { status: 'INVALID_DATA', errorMessage }
        }
        const existSchedule = await scheduleRepository.getSchedule(scheduleId);
        if (!existSchedule) {
            return { status: 'SCHEDULE_NOT_EXIST', errorMessage: 'schedule does not exist, invalid data' }
        }
        const task: Task = {
            id,
            accountId,
            scheduleId,
            startTime,
            duration,
            type
        }
        const result = await repository.createTask(task);
        return { status: 'SUCCESS', task: result }
    }
    async updateTask(task: Task): Promise<TaskUpsertResult> {
        const { id, accountId, scheduleId, startTime, duration, type } = task
        const scheduleInputValidator = new TaskInputValidator(id, accountId, scheduleId, startTime, duration, type)
        const { errorMessage } = scheduleInputValidator.validateData();
        if (errorMessage) {
            return { status: 'INVALID_DATA', errorMessage }
        }
        const existTask = await repository.getTask(id);
        if (!existTask) {
            return { status: 'TASK_NOT_EXIST', errorMessage: 'task does not exist' }
        }
        const existSchedule = await scheduleRepository.getSchedule(scheduleId);
        if (!existSchedule) {
            return { status: 'SCHEDULE_NOT_EXIST', errorMessage: 'schedule does not exist, invalid data' }
        }

        const result = await repository.updateTask(task);
        return { status: 'SUCCESS', task: result }
    }
}

export default TaskService