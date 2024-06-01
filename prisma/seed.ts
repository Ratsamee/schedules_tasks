import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid';
import moment from 'moment'

const prisma = new PrismaClient()

const scheduleData: Prisma.ScheduleCreateInput[] = [{
    id: uuid(),
    accountId: 1,
    agentId: 2,
    startTime: moment.utc().toISOString(),
    endTime: moment.utc().add(1, 'd').toISOString(),
    tasks: {
        create: [{
            id: uuid(),
            startTime: moment.utc().toISOString(),
            duration: 30,
            accountId: 1,
        },
        {
            id: uuid(),
            startTime: moment.utc().add(2, 'd').toISOString(),
            duration: 10,
            accountId: 1,
        }]
    }
}, {
    id: uuid(),
    accountId: 2,
    agentId: 1,
    startTime: moment.utc().toISOString(),
    endTime: moment.utc().add(2, 'd').toISOString(),
    tasks: {
        create: [{
            id: uuid(),
            startTime: moment.utc().add(1, 'd').toISOString(),
            duration: 15,
            accountId: 2,
        }]
    }
}]

async function generateSeedData() {
    for (const scheduleInput of scheduleData) {
        const schedule = await prisma.schedule.create({ data: scheduleInput })
        console.log(`Created schedule with id: ${schedule.id}`);
    }
}

generateSeedData().then(async () => {
    await prisma.$disconnect()
}).catch(async (error) => {
    console.log(error);
    await prisma.$disconnect()
    process.exit(1)
})