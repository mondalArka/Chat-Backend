import { INestApplication } from "@nestjs/common";
import request, { Test } from "supertest";

export function api(app: INestApplication, sessionId?: string): {
    post: (url: string) => Test,
    get: (url: string) => Test
} {
    return {
        post: (url: string) => {
            const req = request(app.getHttpServer()).post(url);
            return sessionId ? req.set('Cookie', `sessionId=${sessionId}`) : req;
        },
        get: (url: string) => {
            const req = request(app.getHttpServer()).get(url);
            return sessionId ? req.set('Cookie', `sessionId=${sessionId}`) : req;
        },
    }
}