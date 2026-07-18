import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

@Injectable()
export class SharedService {
  private readonly emailTransport: Transporter;
  constructor(private readonly configService: ConfigService) {
    console.log({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      user: this.configService.get('SMTP_USERNAME'),
      pass: this.configService.get('SMTP_PASSWORD'),
    });
    this.emailTransport = createTransport({
      host: String(this.configService.get('SMTP_HOST')),
      port: Number(this.configService.get('SMTP_PORT')),
      secure: true,
      auth: {
        user: 'joeclash197@gmail.com',
        pass: 'rvnrtkeyrclulbumb',
      },
    });
  }

  async sendMail(
    toMail: string,
    fromMail: string,
    data: object,
  ): Promise<void> {
    try {
      this.emailTransport.verify((err, success) => {
        console.log(err, 'Errors');
      });
      await this.emailTransport.sendMail({
        from: process.env.SMTP_USERNAME,
        to: toMail,
        subject: data['subject'] || 'No subject',
        ...(data['html'] && { html: data['html'] }),
      });
    } catch (e) {
      console.log(e);
    }
  }
}
