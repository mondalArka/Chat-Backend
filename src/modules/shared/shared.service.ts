import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";

@Injectable()
export class SharedService {
    private readonly emailTransport: Transporter;
    constructor(
        private readonly configService: ConfigService
    ) {
        this.emailTransport = createTransport({
            host: String(this.configService.get("SMTP_HOST")),
            port: Number(this.configService.get("SMTP_PORT")),
            secure: true,
            auth: {
                user: String(this.configService.get("SMTP_USERNAME")),
                pass: String(this.configService.get("SMTP_PASSWORD")),
            },
        });
    }

    async sendMail(toMail: string, fromMail: string, data: object): Promise<void> {
        try {
            await this.emailTransport.sendMail({
                from: process.env.SMTP_USERNAME,
                to: toMail,
                subject: data["subject"] || "No subject",
                ...(data["html"] && { html: data["html"] })
            });
        } catch (e) {
            console.log(e);
        }
    }
}