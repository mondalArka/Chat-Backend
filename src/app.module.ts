import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { useDataSourceFactory } from './config/data-source';
import { HTTPException } from './filter/exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JWTModule } from './modules/jwt/jwt.module';
import { AuthGuard } from './guards/auth.guard';
import { RepositoryModule } from './repositories/repository.module';
import { SharedModule } from './modules/shared/shared.module';
import { RedisModule } from './modules/redis/redis.module';
import { MessageModule } from './modules/message/message.module';
import { ChatModule } from './modules/chat/chat.module';
import { SocketModule } from './modules/websocket/socket.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    SocketModule,
    SharedModule,
    RedisModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: useDataSourceFactory,
      inject: [ConfigService]
    }),
    RepositoryModule.forFeature(['USER_REPOSITORY']),
    JWTModule.forRoot(),
    AuthModule,
    ChatModule,
    MessageModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HTTPException
    }
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log("🕐 Server timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log("🕐 UTC offset:", new Date().getTimezoneOffset(), "minutes");
    console.log("🕐 Current server time:", new Date().toString());
  }
}
