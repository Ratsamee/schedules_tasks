import {
    SearchTasksCriteria,
    Task, TaskInput,
    TaskSearchResult,
    TaskUpsertResult,
    TaskDeleteResult
} from "../../entities/task/task.entity";
import TaskInputValidator from "../../entities/task/taskInputValidator";
import ITaskService from "./task.interface"
import TaskRepository from '../../repositories/tasks/task'
import ScheduleRepository from '../../repositories/schedules/schedule'
import { v4 as uuid } from 'uuid'
import Joi from 'joi'

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
    private isTaskIdValid(taskId: string): boolean {
        const schema = Joi.object({ id: Joi.string().required().uuid() })
        const { error } = schema.validate({ id: taskId })
        return error?.message ? false : true
    }

    async deleteTask(id: string): Promise<TaskDeleteResult> {
        if (!this.isTaskIdValid(id)) {
            return { status: 'TASK_ID_INVALID', errorMessage: 'task id is invalid' }
        }
        const task = await repository.getTask(id)
        if (!task) {
            return { status: 'TASK_NOT_EXIST', errorMessage: `task doesn't exist` }
        }
        await repository.deleteTask(id)
        return { status: 'SUCCESS', deleteTaskIds: [id] }
    }
    async deleteTasks(ids: string[]): Promise<TaskDeleteResult> {
        const taskFunctions: any[] = [];
        // get only valid id
        ids.forEach((id) => {
            if (this.isTaskIdValid(id)) {
                taskFunctions.push(repository.getTask(id))
            }
        })
        const taskSearchResult = await Promise.allSettled(taskFunctions);
        const tasksIds: string[] = []
        // get exist task id
        taskSearchResult.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
                const task = result.value as Task;
                tasksIds.push(task.id)
            }
        })
        if (!tasksIds.length) {
            return { status: 'TASK_NOT_EXIST', errorMessage: `there is no tasks exist all list` }
        }
        const deletedTaskIds = await repository.deleteTasks(tasksIds)
        return { status: 'SUCCESS', deleteTaskIds: deletedTaskIds }
    }
}

export default TaskService