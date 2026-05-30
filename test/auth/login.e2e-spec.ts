import { api } from "test/helpers/request.helper";
import { INestApplication } from "@nestjs/common";
import { bootstrapApp, closeApp } from "test/helpers/bootstrap.helper";

describe("Auth Login e2e for route", () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapApp();
    });

    afterAll(async () => {
        await closeApp();
    })

    describe("POST /auth/login-verify", () => {
        it("should return 200 with successful login", async () => {
            const res = await api(app)
                .post("/auth/signin")
                .send({ email: "sujay@yopmail.com" })
                .expect(200);
            const sessionId = res.body?.data?.session?.sessionId;
            const otp = "123456";
            await api(app)
                .post("/auth/login-verify")
                .send({ sessionId, otp })
                .expect(200);
        })
    });
})