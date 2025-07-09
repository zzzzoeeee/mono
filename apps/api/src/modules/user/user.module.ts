import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserRepository } from './repositories';
import { UserService } from './services';

@Module({
	providers: [UserService, UserRepository],
	exports: [UserService],
	controllers: [UserController],
})
export class UserModule {}
