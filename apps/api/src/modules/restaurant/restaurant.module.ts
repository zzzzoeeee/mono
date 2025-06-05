import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers';
import { RestaurantService } from './services';
import { RestaurantRepository } from './repositories';

@Module({
	controllers: [RestaurantController],
	providers: [RestaurantService, RestaurantRepository],
	exports: [RestaurantService],
})
export class RestaurantModule {}
