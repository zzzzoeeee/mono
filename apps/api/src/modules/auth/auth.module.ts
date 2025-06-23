import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers';
import { SessionSerializer } from './serializers';
import { AuthService } from './services';
import { LocalStrategy } from './strategies';

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
