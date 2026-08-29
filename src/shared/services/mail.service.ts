import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from '@config/index';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    // In a real scenario, use config to setup transport.
    // For now, logging to console for dev, or setup dummy
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'dummy',
        pass: 'dummy',
      },
    });
  }

  async send(options: SendMailOptions): Promise<void> {
    this.logger.log(`Sending email to ${options.to}: ${options.subject}`);
    // await this.transporter.sendMail({
    //   from: 'no-reply@ecommerce.com',
    //   ...options,
    // });
  }
}
