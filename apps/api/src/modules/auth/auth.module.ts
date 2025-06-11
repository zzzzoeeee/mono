import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { LocalStrategy	 } from './strategies';
import { UserModule } from '../user/user.module';

@Global()
@Module({
	imports: [
		UserModule,
		PassportModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
	exports: [AuthService],
})
export class AuthModule {}