import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { LocalStrategy } from './strategies';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './serializers';

@Global()
@Module({
	imports: [
		UserModule,
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
