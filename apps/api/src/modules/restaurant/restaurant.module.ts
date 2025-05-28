import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers';

@Module({
	controllers: [RestaurantController],
	providers: [],
	exports: [],
})
export class RestaurantModule {}
