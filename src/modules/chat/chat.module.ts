import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RepositoryModule } from 'src/repositories/repository.module';
import { ChatRepo, ParticipantRepo } from 'src/repositories/index.repositories';
import { SocketModule } from '../websocket/socket.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RepositoryModule.forFeature([ChatRepo, ParticipantRepo]),
    SocketModule,
    RedisModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
