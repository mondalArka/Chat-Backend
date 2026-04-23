import { HttpException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/entities/User.entity";
import { UserRepository } from "src/repositories/user.repository";
import { SignupDto } from "./dto/signup.dto";
import { ApiResponse } from "src/interfaces.enums/response.types";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { SessionRepository } from "src/repositories/session.repositories";
import { SessionDto } from "./dto/session.dto";
import { Sessions } from "src/entities/Otp.entity";
import generateOtp from "src/helpers/otpgenerate";
import { SingnInDto } from "./dto/signin.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { renderFile } from "ejs";
import { join } from "path";
import { QueueNames } from "src/interfaces.enums/queue.enums";
import { RedisProvider } from "../redis/redis.provider";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";
import { SignOptions } from "jsonwebtoken";
import { UserType } from "src/interfaces.enums/user.types";

@Injectable()
export class AuthService {
    private redis: Redis;
    constructor(
        @InjectQueue("email-queue")
        private readonly emailQueue: Queue,
        @Inject("USER_REPOSITORY")
        private readonly userRepo: UserRepository,
        @Inject("SESSION_REPOSITORY")
        private readonly sessionRepo: SessionRepository,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisProvider,
        private readonly configService: ConfigService
    ) {
        this.redis = this.redisService.getRedisClient();
    }

    async signup(user: SignupDto): Promise<ApiResponse<{
        session: Partial<Sessions>
    }>> {
        const sessionExists = await this.sessionRepo.findByEmail(user.email);
        const userExists = await this.userRepo.findByEmail(user.email);
        if (userExists)
            throw new HttpException("User already exists", 409);

        const sessionId = uuidv4();
        const otp = generateOtp(6);
        const template = await renderFile(join(process.cwd(), "public/templates/Email", "otp.ejs"), { name: user.name, otp });
        await this.emailQueue.add(QueueNames.OTP, {
            toMail: user.email,
            fromMail: "Etheral Chat",
            subject: "OTP",
            html: template
        });
        if (sessionExists) {
            // sessionExists.sessionId = sessionId;
            sessionExists.otp = otp;
            sessionExists.expiresAt = new Date(Date.now() + 2 * 60 * 1000);
            await this.sessionRepo.saveSession(sessionExists);
            return {
                success: true,
                statusCode: 200,
                message: "OTP sent to email",
                data: {
                    session: {
                        sessionId: sessionExists.sessionId
                    }
                }
            };
        }
        const data = await this.sessionRepo.saveSession({
            email: user.email,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            sessionId,
            otp,
            userData: {
                name: user.name
            }
        });
        return {
            success: true,
            statusCode: 201,
            message: "User created",
            data: {
                session: {
                    sessionId: data.sessionId
                }
            }
        };
    }

    async verifyRegistration(sessionDto: SessionDto): Promise<ApiResponse<{
        user: Partial<User>,
    }>> {
        const sessionExists = await this.sessionRepo.findBySessionId(sessionDto.sessionId);

        if (!sessionExists)
            throw new HttpException("Session not found", 404);

        if (sessionExists.expiresAt.getTime() < new Date().getTime())
            throw new HttpException("Session expired", 401);

        if (sessionDto.otp !== sessionExists.otp)
            throw new HttpException("Invalid OTP", 401);

        const userData = await this.userRepo.saveUser({
            email: sessionExists.email,
            name: sessionExists?.userData!["name"] || "unknown"
        });
        await this.sessionRepo.deleteBySessionId(sessionExists.sessionId);
        return {
            success: true,
            statusCode: 200,
            message: "User verified",
            data: {
                user: userData,
            }
        }
    }

    async login(signinDto: SingnInDto): Promise<ApiResponse<{
        session: Partial<Sessions>
    }>> {
        const userExists = await this.userRepo.findByEmail(signinDto.email);
        if (!userExists)
            throw new HttpException("User with this email does not exist", 404);
        const sessionId = uuidv4();
        const otp = generateOtp(6);
        const checkSession = await this.sessionRepo.findByEmail(signinDto.email);
        const template = await renderFile(join(process.cwd(), "public/templates/Email", "otp.ejs"), { name: userExists.name, otp });

        await this.emailQueue.add(QueueNames.OTP, {
            toMail: signinDto.email,
            fromMail: "Etheral Chat",
            subject: "OTP",
            html: template
        });
        if (checkSession) {
            checkSession.otp = otp;
            checkSession.expiresAt = new Date(Date.now() + 2 * 60 * 1000);
            await this.sessionRepo.saveSession(checkSession);
            return {
                success: true,
                statusCode: 200,
                message: "OTP sent to email",
                data: {
                    session: {
                        sessionId: checkSession.sessionId
                    }
                }
            };
        }

        const data = await this.sessionRepo.saveSession({
            email: signinDto.email,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            sessionId,
            otp,
        });
        return {
            success: true,
            statusCode: 200,
            message: "OTP sent to email",
            data: {
                session: {
                    sessionId: data.sessionId
                }
            }
        };
    }

    async loginVerify(loginDto: SessionDto): Promise<ApiResponse<{
        sessionId: string,
        user: Partial<User>
    }>> {
        const sessionExists = await this.sessionRepo.findBySessionId(loginDto.sessionId);
        if (!sessionExists)
            throw new HttpException("Session not found", 404);

        if (sessionExists.expiresAt.getTime() < new Date().getTime())
            throw new HttpException("Session expired", 401);

        if (loginDto.otp !== sessionExists.otp)
            throw new HttpException("Invalid OTP", 401);

        const user = await this.userRepo.findByEmail(sessionExists.email);
        if (!user)
            throw new HttpException("User not found", 404);

        const refreshToken = this.jwtService.sign({ id: user.id }, { expiresIn: "7d" });
        const redisSession = uuidv4();
        await this.sessionRepo.deleteBySessionId(sessionExists.sessionId);
        await this.redis.set(`session:${redisSession}`, JSON.stringify({
            refreshToken
        }), "EX", 20 * 60);
        return {
            success: true,
            statusCode: 200,
            message: "Login successful",
            data: {
                sessionId: redisSession,
                user
            }
        }
    }

    async logout(sessionId: string): Promise<ApiResponse<{}>> {
        const redis = this.redisService.getRedisClient();
        await redis.del(`session:${sessionId}`);
        return {
            success: true,
            statusCode: 200,
            message: "Logout successful",
            data: {}
        }
    }

    async Token(sessionId: string): Promise<ApiResponse<{ sessionId: string }>> {
        const redis = this.redisService.getRedisClient();
        const session = await redis.get(`session:${sessionId}`);
        if (!session)
            throw new UnauthorizedException("No session found");
        const parsed = JSON.parse(session);

        if (!parsed?.refreshToken)
            throw new UnauthorizedException("No sesssion found");

        let decode: any;
        try {
            decode = this.jwtService.verify(parsed.refreshToken);
        } catch (e) {
            throw new UnauthorizedException("Invalid token");
        }

        const Token = this.jwtService.sign({ id: decode.id }, { expiresIn: this.configService.get<string>("TOKEN_EXPIRE") as SignOptions["expiresIn"] });
        const newSession = uuidv4();
        await redis.set(`session:${newSession}`, JSON.stringify({
            Token
        }), "EX", 20 * 60);
        await redis.del(`session:${sessionId}`);
        return {
            success: true,
            statusCode: 200,
            message: "Token generated",
            data: {
                sessionId: newSession
            }
        }
    }

    async authenticated(user: UserType): Promise<ApiResponse<{ user: UserType, authenticated: boolean }>> {
        const userData = await this.userRepo.findOneBy({ id: String(user.id) });
        return {
            success: true,
            statusCode: 200,
            message: "Authenticated",
            data: { 
                user: userData as UserType,
                authenticated: true
            }
        }
    }
}