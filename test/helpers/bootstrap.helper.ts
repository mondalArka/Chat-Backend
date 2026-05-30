import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import cookieParser from 'cookie-parser';
import { api } from './request.helper';

let app: INestApplication | null = null;
export async function bootstrapApp(): Promise<INestApplication> {
  if (app) return app;;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  await app.init();

  return app;
}

export async function closeApp(): Promise<void> {
  await app?.close();
}

export const AppInitializerWithAuthenticate = async (): Promise<{
  sessionId: string,
  app: INestApplication
}> => {
  if (!app) await bootstrapApp();
  const res = await api(app as INestApplication)
    .post("/auth/signin")
    .send({ email: "sujay@yopmail.com" })
    .expect(200);
  const tempSession = res.body?.data?.session?.sessionId;
  const verifyRes = await api(app as INestApplication)
    .post("/auth/login-verify")
    .send({ sessionId: tempSession, otp: "123456" })
    .expect(200);

  return { sessionId: verifyRes.body?.data?.sessionId, app: app as INestApplication };
}