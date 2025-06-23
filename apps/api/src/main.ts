import env from '@config/env';
import { NestFactory, Reflector } from '@nestjs/core';
import { PrismaClient } from '@prisma-client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { AuthenticatedGuard } from 'modules/auth/guards';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: env.CORS_ORIGINS,
		credentials: true,
	});

	app.use(cookieParser());
	app.use(
		session({
			secret: env.SESSION_SECRET,
			name: env.SESSION_NAME,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 60 * 60 * 1000,
				secure: env.NODE_ENV === 'production',
			},
			store: new PrismaSessionStore(new PrismaClient(), {
				checkPeriod: 2 * 60 * 1000,
			}),
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());

	app.useGlobalGuards(new AuthenticatedGuard(app.get(Reflector)));

	await app.listen(env.PORT ?? 3000);
}

bootstrap();
