import { ConfigService } from '@nestjs/config';
export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare class MailService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    send(options: SendMailOptions): Promise<void>;
}
