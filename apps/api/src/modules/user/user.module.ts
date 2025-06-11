import { Global, Module } from '@nestjs/common';
import { UserService } from './services';
import { UserRepository } from './repositories';

@Global()
@Module({
	providers: [UserService, UserRepository],
	exports: [UserService],
})
export class UserModule {}