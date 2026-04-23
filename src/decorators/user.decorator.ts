import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from 'src/interfaces.enums/user.types';

export const CurrentUser = createParamDecorator(
    (data: keyof UserType, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as UserType;
        if (!user) return null;
        return data ? request.user[data] : user;
    }
);