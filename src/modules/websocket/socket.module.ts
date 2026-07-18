import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.service';
import { RedisModule } from '../redis/redis.module';
import { RepositoryModule } from 'src/repositories/repository.module';
import { JwtModule } from '@nestjs/jwt';
import { ParticipantRepo, UserRepo } from 'src/repositories/index.repositories';

@Module({
  imports: [
    RedisModule,
    RepositoryModule.forFeature([UserRepo, ParticipantRepo]),
    JwtModule,
  ],
  controllers: [],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
