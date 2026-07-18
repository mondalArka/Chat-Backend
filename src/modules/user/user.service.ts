import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { User } from 'src/entities/User.entity';
import { ApiResponse } from 'src/interfaces.enums/response.types';
import { UserType } from 'src/interfaces.enums/user.types';
import { UserRepository } from 'src/repositories/user.repository';
import { Not } from 'typeorm';
import { RedisProvider } from '../redis/redis.provider';
import { ConfigService } from '@nestjs/config';
import { InvitationDto } from './dto/invite.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueNames } from 'src/interfaces.enums/queue.enums';
import { renderFile } from 'ejs';

@Injectable()
export class UserService {
  private readonly redis: Redis;
  private readonly redisExpire: number;
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepo: UserRepository,
    private readonly redisService: RedisProvider,
    private readonly configService: ConfigService,
    @InjectQueue('invite-queue')
    private readonly inviteQueue: Queue,
  ) {
    this.redis = this.redisService.getRedisClient();
    this.redisExpire = Number(this.configService.get('REDIS_EXPIRE')) + 2700; // 1hr
  }

  async getAllUser(
    user: UserType,
    refresh: boolean = false,
  ): Promise<ApiResponse<User[]>> {
    const cache = await this.redis.get(`${user.id}:getAllUsers`);
    if (cache && !refresh)
      return {
        statusCode: 200,
        success: true,
        message: 'Users fetched successfully',
        data: JSON.parse(cache),
      };

    const data = await this.userRepo.find({
      where: { id: Not(user.id) },
      select: ['id', 'name', 'email'],
    });
    await this.redis.set(
      `${user.id}:getAllUsers`,
      JSON.stringify(data),
      'EX',
      this.redisExpire,
    );
    return {
      statusCode: 200,
      success: true,
      message: 'Users fetched successfully',
      data,
    };
  }

  async inviteUser(
    user: UserType,
    body: InvitationDto,
  ): Promise<ApiResponse<null>> {
    const template = await renderFile(
      process.cwd() + '/public/templates/invite.ejs',
      {
        name: user.name,
        email: body.email,
        inviteLink: this.configService.get('INVITE_LINK'),
      },
    );
    await this.inviteQueue.add(QueueNames.INVITE, {
      toMail: body.email,
      fromMail: this.configService.get('MAIL_FROM'),
      subject: 'Invitation to join our platform',
      html: template,
    });
    return {
      statusCode: 200,
      success: true,
      message: 'User invited successfully',
      data: null,
    };
  }
}
