import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RepositoryModule } from 'src/repositories/repository.module';
import { RedisModule } from '../redis/redis.module';
import { UserRepo } from 'src/repositories/index.repositories';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    RepositoryModule.forFeature([UserRepo]),
    BullModule.registerQueue({
      name: 'invite-queue',
    }),
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
