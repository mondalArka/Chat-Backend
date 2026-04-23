import { Body, Controller, Get, HttpException, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { SignupDto } from "./dto/signup.dto";
import { AuthService } from "./auth.service";
import { SessionDto } from "./dto/session.dto";
import { SingnInDto } from "./dto/signin.dto";
import type { Request, Response } from "express";
import { sessionSetter } from "src/helpers/cookie.config";
import { CurrentUser } from "src/decorators/user.decorator";
import type { UserType } from "src/interfaces.enums/user.types";

@Controller("auth")
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Post("signup")
    async signup(
        @Body() body: SignupDto
    ) {
        return this.authService.signup(body);
    }

    @Public()
    @Post("verify-registration")
    async verifyRegistration(
        @Body() body: SessionDto
    ) {
        return this.authService.verifyRegistration(body);
    }

    @Public()
    @Post("signin")
    async login(
        @Body() body: SingnInDto
    ) {
        return this.authService.login(body);
    }

    @Public()
    @Post("login-verify")
    async loginVerify(
        @Body() body: SessionDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.loginVerify(body);
        sessionSetter(res, result?.data?.sessionId as string);
        return result;
    }

    @Get("/logout")
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const sessionId = req.cookies['sessionId'];
        if (!sessionId)
            throw new HttpException("Session not found", 404);

        res.clearCookie("sessionId");
        return this.authService.logout(sessionId);
    }

    @Get("/refresh-token")
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const sessionId = req.cookies?.sessionId;

        if (!sessionId) {
            throw new UnauthorizedException("No session");
        }
        const result = await this.authService.Token(sessionId);
        sessionSetter(res, result?.data?.sessionId as string);
        return {
            ...result,
            data: {}
        };
    }

    @Get("/me")
    async getMe(
        @CurrentUser() user: UserType
    ) {
        return this.authService.authenticated(user);
    }
}