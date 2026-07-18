import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RepositoryModule } from 'src/repositories/repository.module';
import { ChatRepo, ParticipantRepo } from 'src/repositories/index.repositories';

@Module({
  imports: [RepositoryModule.forFeature([ChatRepo, ParticipantRepo])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
