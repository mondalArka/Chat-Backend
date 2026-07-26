import { Response } from 'express';
import { config } from 'dotenv';
config();
export const sessionSetter = (res: Response, sessionId: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
