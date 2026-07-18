import { INestApplication } from '@nestjs/common';
import { bootstrapApp, closeApp } from 'test/helpers/bootstrap.helper';
import { api } from 'test/helpers/request.helper';
import { expect } from '@jest/globals';
import { Participant } from 'src/entities/Participant.entity';
import { ApiResponse } from 'src/interfaces.enums/response.types';

describe('Chat e2e for route', () => {
  let app: INestApplication;
  let sessionId: string;
  beforeAll(async () => {
    app = await bootstrapApp();
    const res = await api(app)
      .post('/auth/signin')
      .send({ email: 'sujay@yopmail.com' })
      .expect(200);

    const tempSession = res.body?.data?.session?.sessionId;
    const otp = '123456';

    const verifyRes = await api(app)
      .post('/auth/login-verify')
      .send({ sessionId: tempSession, otp })
      .expect(200);
    sessionId = verifyRes.body?.data?.sessionId;
  });

  afterAll(async () => {
    await closeApp();
  });

  describe('GET /chat', () => {
    let participants: ApiResponse<Partial<Participant[]>>;
    it('should return the chats for the logged in user', async () => {
      const res = await api(app, sessionId).get('/chat').expect(200);

      participants = res.body;
    });

    it('should return participants for chat id', async () => {
      const res = await api(app, sessionId)
        .get(`/chat/${participants?.data?.[0]?.userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body?.message).toContain('Participants fetched');
        });
    });
  });
});
