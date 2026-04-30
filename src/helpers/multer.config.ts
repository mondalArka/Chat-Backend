import { diskStorage } from 'multer';
import { Request } from 'express';
import { type Options } from 'multer';
export const multerConfig = (options?: Options["limits"]) => {
    return {
        storage: diskStorage({
            destination: process.cwd() + '/public/uploads',
            filename(req: Request, file: Express.Multer.File, callback) {
                callback(null, Date.now().toString().slice(0, 6) + file.originalname.split(' ').join('_'));
            }
        }),
        ...(options && {
            limits: options
        })
    };
}