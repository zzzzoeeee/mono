import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from '@config/env';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: env.CORS_ORIGINS,
	});

	await app.listen(env.PORT ?? 3000);
}

bootstrap();
