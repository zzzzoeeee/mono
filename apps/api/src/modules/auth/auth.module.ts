import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers';
import { SessionSerializer } from './serializers';
import { AuthService } from './services';
import { LocalStrategy } from './strategies';

@Module({
	imports: [
		PassportModule.register({
			defaultStrategy: 'local',
			session: true,
		}),
	],
	providers: [AuthService, LocalStrategy, SessionSerializer],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
