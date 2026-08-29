"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const index_1 = require("./common/index");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug'],
    });
    const config = app.get(config_1.ConfigService);
    const appConfig = config.get('app');
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: appConfig.frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalInterceptors(new index_1.ResponseInterceptor());
    app.useGlobalFilters(new index_1.AllExceptionsFilter());
    if (!appConfig.isProduction) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle(appConfig.name)
            .setDescription('E-commerce backend API documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    await app.listen(appConfig.port);
    const logger = new common_1.Logger('Bootstrap');
    logger.log(`🚀 ${appConfig.name} running on ${appConfig.baseUrl}/api`);
    logger.log(`📘 Swagger docs: ${appConfig.baseUrl}/api/docs`);
}
bootstrap().catch((err) => {
    console.error('Fatal bootstrap error:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map