import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from 'src/processors/email.processors';
import { SharedModule } from '../shared/shared.module';
import { InviteProcessor } from 'src/processors/invite.processors';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          connection: {
            host: String(config.get('REDIS_HOST')),
            port: Number(config.get('REDIS_PORT')),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
      defaultJobOptions: {
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: { count: 50, age: 3600 },
        delay: 0,
        priority: 1,
      },
    }),
    BullModule.registerQueue({
      name: 'invite-queue',
      defaultJobOptions: {
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: { count: 50, age: 3600 },
        delay: 0,
        priority: 1,
      },
    }),
  ],
  providers: [EmailProcessor, InviteProcessor],
})
export class WorkerModule {}
