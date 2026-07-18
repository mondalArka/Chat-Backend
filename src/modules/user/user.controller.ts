import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { type UserType } from 'src/interfaces.enums/user.types';
import { InvitationDto } from './dto/invite.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUser(
    @CurrentUser() user: UserType,
    @Query('refresh', new ParseBoolPipe({ optional: true })) refresh?: boolean,
  ) {
    return this.userService.getAllUser(user, refresh);
  }

  @Post('/invite')
  async inviteUser(@Body() body: InvitationDto, @CurrentUser() user: UserType) {
    return this.userService.inviteUser(user, body);
  }
}
