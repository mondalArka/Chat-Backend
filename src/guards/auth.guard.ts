import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { JwtService } from "@nestjs/jwt";
import { RedisProvider } from "src/modules/redis/redis.provider";
import { UserRepository } from "src/repositories/user.repository";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject("USER_REPOSITORY")
        private readonly userRepo: UserRepository,
        private readonly reflect: Reflector,
        private readonly redisService: RedisProvider,
        private readonly jwtService: JwtService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflect.get('isPublic', context.getHandler());

        if (isPublic)
            return true;
        const req = context.switchToHttp().getRequest();
        const sessionId = req.cookies['sessionId']

        if (!sessionId)
            throw new UnauthorizedException("No session");

        let redis = this.redisService.getRedisClient();
        const session = await redis.get(`session:${sessionId}`);

        if (!session)
            throw new UnauthorizedException("No session found");

        const parsed = JSON.parse(session);
        if (!parsed?.refreshToken)
            throw new UnauthorizedException("No token found");

        let decode: any;
        try {
            decode = this.jwtService.verify(parsed.refreshToken);
        } catch (e) {
            throw new UnauthorizedException("Invalid token");
        }

        const user = await this.userRepo.findOneBy({
            id: decode?.id
        });

        if (!user)
            throw new UnauthorizedException("No user found");

        req.user = {
            id: user.id
        };

        return true;
    }
}