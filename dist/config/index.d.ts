export declare const appConfig: (() => {
    port: number;
    name: string;
    baseUrl: string;
    frontendUrl: string;
    isProduction: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    name: string;
    baseUrl: string;
    frontendUrl: string;
    isProduction: boolean;
}>;
export declare const authConfig: (() => {
    jwtSecret: string;
    jwtExpiresIn: string;
    magicLinkTokenExpiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwtSecret: string;
    jwtExpiresIn: string;
    magicLinkTokenExpiresIn: string;
}>;
export declare const mailConfig: (() => {
    magicLinkFrontendUrl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    magicLinkFrontendUrl: string;
}>;
export interface AppConfig {
    port: number;
    name: string;
    baseUrl: string;
    frontendUrl: string;
    isProduction: boolean;
}
export interface AuthConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
    magicLinkTokenExpiresIn: string;
}
export interface MailConfig {
    magicLinkFrontendUrl: string;
}
export declare const allConfigs: (((() => {
    port: number;
    name: string;
    baseUrl: string;
    frontendUrl: string;
    isProduction: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    name: string;
    baseUrl: string;
    frontendUrl: string;
    isProduction: boolean;
}>) | ((() => {
    jwtSecret: string;
    jwtExpiresIn: string;
    magicLinkTokenExpiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwtSecret: string;
    jwtExpiresIn: string;
    magicLinkTokenExpiresIn: string;
}>) | ((() => {
    magicLinkFrontendUrl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    magicLinkFrontendUrl: string;
}>))[];
