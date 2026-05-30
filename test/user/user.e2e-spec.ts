import { INestApplication } from "@nestjs/common";
import { bootstrapApp, closeApp } from "test/helpers/bootstrap.helper";
import { api } from "test/helpers/request.helper";

describe("User e2e for route", () => {
    let app: INestApplication;
    let sessionId: string;
    beforeAll(async () => {
        app = await bootstrapApp();
        const res = await api(app)
            .post("/auth/signin")
            .send({ email: "sujay@yopmail.com" })
            .expect(200);

        const tempSession = res.body?.data?.session?.sessionId;
        const otp = "123456";

        const verifyRes = await api(app)
            .post("/auth/login-verify")
            .send({ sessionId: tempSession, otp })
            .expect(200);
        sessionId = verifyRes.body?.data?.sessionId;
    })

    afterAll(async () => {
        await closeApp();
    })

    describe("GET /user", () => {
        it("should return 200 with users data", async () => {
            const res = await api(app, sessionId)
                .get("/user")
                .expect(200);
        });
    });
});