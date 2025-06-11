import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from '@config/env';
import * as session from 'express-session';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: env.CORS_ORIGINS,
	});

	app.use(session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	}));

	await app.listen(env.PORT ?? 3000);
}

bootstrap();
