import { Request, Response, NextFunction } from "express"
import { StatusCodes } from 'http-status-codes'
import { rateLimit } from 'express-rate-limit'

export const validateAuthorise = (req: Request, res: Response, next: NextFunction) => {
    const authSecret = req.headers.authsecret;
    if (authSecret === process.env.AUTH_SECRET) {
        return next()
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' })
}

export const rateLimitGetAction = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})

export const rateLimitUpdateAction = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 50,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})