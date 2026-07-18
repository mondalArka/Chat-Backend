import { Module } from '@nestjs/common';
import { NotificationRepo } from 'src/repositories/index.repositories';
import { RepositoryModule } from 'src/repositories/repository.module';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [RepositoryModule.forFeature([NotificationRepo])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [],
})
export class NotificationModule {}
