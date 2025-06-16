import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import env from '@config/env';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { AuthenticatedGuard } from 'modules/auth/guards';
import * as passport from 'passport'; 

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: env.CORS_ORIGINS,
	});

	app.use(cookieParser());
	app.use(
		session({
			secret: env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 60 * 60 * 1000,
				secure: env.NODE_ENV === 'production',
			},
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());

	app.useGlobalGuards(new AuthenticatedGuard(app.get(Reflector)));

	await app.listen(env.PORT ?? 3000);
}

bootstrap();
