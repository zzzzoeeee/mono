import { Global, Module } from '@nestjs/common';
import { UserService } from './services';
import { UserRepository } from './repositories';
import { UserController } from './controllers';

@Global()
@Module({
	providers: [UserService, UserRepository],
	exports: [UserService],
	controllers: [UserController],
})
export class UserModule {}