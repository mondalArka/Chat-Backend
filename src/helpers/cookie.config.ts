import { Response } from "express";

export const sessionSetter = (res: Response, sessionId: string) => {
    res.cookie('sessionId', sessionId, {
        httpOnly: false,
        secure: false,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}