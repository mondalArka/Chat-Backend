import { createLogger, format, transports } from 'winston';
import fs from 'fs';

if(!fs.existsSync)
    fs.mkdirSync('logs');

export const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm' }),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/app.log' }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            ),
            level:  'error'
        })
    ]
})