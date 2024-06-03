import http from 'http'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import scheduleRouter from './routers/scheduleRouter'

const port = process.env.PORT || 3000
export const application = express()
export let httpServer: ReturnType<typeof http.createServer>

application.use(express.urlencoded({ extended: true }))
application.use(express.json())
application.use(cors())
application.use(helmet())

application.use('/schedules', scheduleRouter)

httpServer = http.createServer(application)
httpServer.listen(3000, () => {
    console.log(`Server running at http://localhost:${port}`)
})