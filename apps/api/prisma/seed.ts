import { faker } from '@faker-js/faker/locale/en';
import {
	MenuCategory,
	Order,
	OrderStatus,
	PricePlan,
	PrismaClient,
	RestaurantUserRole,
	Table,
	UserRole,
	Visit,
	VisitStatus,
} from '@prisma-client';

const prisma = new PrismaClient();

// Helper functions
const randomInt = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T =>
	arr[Math.floor(Math.random() * arr.length)];
const randomElements = <T>(arr: T[], count: number): T[] => {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
};

// Data generators
const DEFAULT_PASSWORD_HASH =
	'$argon2id$v=19$m=65536,t=3,p=4$X40vXI3KUvJojm7XmEseag$kQ5EyaFjUV9D7L+dzsWhO/Ldy+eILhTduw1iP3shhqw'; // hashed 'password123'

const SEED_CONFIG = {
	USER_COUNTS: {
		ADMIN: 2,
		REGULAR: 100,
	},
	RESTAURANT_COUNT: 3,
	RESTAURANT_USER_COUNTS: {
		MIN: 5,
		MAX: 20,
		MANAGER_MIN: 1,
		MANAGER_MAX: 2,
	},
	MENU_COUNTS: {
		MIN: 20,
		MAX: 100,
	},
	TABLE_COUNTS: {
		MIN: 4,
		MAX: 20,
	},
	PRICE_PLAN_COUNTS: {
		MIN: 2,
		MAX: 5,
	},
	VISIT_COUNTS: {
		MIN: 10,
		MAX: 100,
	},
	ORDER_COUNTS: {
		MIN: 1,
		MAX: 5,
	},
	ORDER_ITEM_COUNTS: {
		MIN: 1,
		MAX: 5,
	},
	PROBABILITIES: {
		MENU_AVAILABLE: 0.9,
		TABLE_ACTIVE: 0.9,
		VISIT_FINISHED: 0.7,
		VISIT_NOTES: 0.3,
		ORDER_NOTES: 0.1,
		ORDER_ITEM_NOTES: 0.1,
		ORDER_COMPLETED_IF_VISIT_FINISHED: 0.95,
		HAS_BUFFET_PRICE_PLAN: 0.7,
	},
	DATE_RANGES: {
		VISIT_FROM: '2025-01-01',
		VISIT_TO: new Date(),
	},
	MENU_PRICE_RANGE: {
		MIN: 10,
		MAX: 500,
	},
	BUFFET_PRICE_RANGE: {
		MIN: 179,
		MAX: 2000,
	},
	TABLE_CAPACITY_RANGE: {
		MIN: 2,
		MAX: 8,
	},
	VISIT_DURATION_RANGE: {
		MIN: 30,
		MAX: 240,
	},
};

const generateUser = (index: number, role: UserRole) => ({
	email: `${role === UserRole.ADMIN ? 'admin' : 'user'}${index}@example.com`,
	password: DEFAULT_PASSWORD_HASH,
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	role,
});

const generateRestaurant = (index: number) => {
	const companyName = faker.company.name();
	const companySuffix = faker.company.catchPhraseAdjective();

	return {
		name: `${companyName} ${companySuffix}`,
		address: faker.location.streetAddress(),
		phone: faker.phone.number(),
		website: faker.internet.url(),
		image: `https://picsum.photos/seed/restaurant-${index}/800/600`,
	};
};

const menuCategories = [
	MenuCategory.APPETIZER,
	MenuCategory.MAIN,
	MenuCategory.DESSERT,
	MenuCategory.BEVERAGE,
];

const generateMenu = (restaurantId: string, index: number) => {
	return {
		restaurantId,
		name: `${faker.food.dish()} ${index + 1}`,
		description: faker.food.description(),
		price: faker.number.float({
			min: SEED_CONFIG.MENU_PRICE_RANGE.MIN,
			max: SEED_CONFIG.MENU_PRICE_RANGE.MAX,
			fractionDigits: 2,
		}),
		category: randomElement(menuCategories),
		isAvailable: faker.datatype.boolean(
			SEED_CONFIG.PROBABILITIES.MENU_AVAILABLE,
		),
		image: `https://picsum.photos/seed/menu-${index}/400/300`,
	};
};

const generateTable = (restaurantId: string, index: number) => ({
	restaurantId,
	name: `Table ${index + 1}`,
	capacity: randomInt(
		SEED_CONFIG.TABLE_CAPACITY_RANGE.MIN,
		SEED_CONFIG.TABLE_CAPACITY_RANGE.MAX,
	),
	isActive: faker.datatype.boolean(SEED_CONFIG.PROBABILITIES.TABLE_ACTIVE),
});

const generatePricePlan = (
	restaurantId: string,
	index: number,
	isBuffet: boolean = false,
) => ({
	restaurantId,
	name: `${isBuffet ? 'Buffet' : 'Plan'} ${index + 1}`,
	description: faker.lorem.sentence({ min: 10, max: 20 }),
	price: isBuffet
		? faker.number.float({
				min: SEED_CONFIG.BUFFET_PRICE_RANGE.MIN,
				max: SEED_CONFIG.BUFFET_PRICE_RANGE.MAX,
				fractionDigits: 2,
			})
		: 0,
	isActive: true,
});

const generateVisit = (
	restaurantId: string,
	table: Table,
	pricePlan: PricePlan,
	fromDate: Date,
	toDate: Date,
) => {
	const duration = randomInt(
		SEED_CONFIG.VISIT_DURATION_RANGE.MIN,
		SEED_CONFIG.VISIT_DURATION_RANGE.MAX,
	);
	const isFinished = faker.datatype.boolean(
		SEED_CONFIG.PROBABILITIES.VISIT_FINISHED,
	);
	const [visitedAt, departedAt] = faker.date.betweens({
		from: fromDate,
		to: toDate,
		count: 2,
	});

	return {
		restaurantId,
		tableId: table.id,
		pricePlanId: pricePlan.id,
		customerCount: randomInt(1, table.capacity),
		status: isFinished ? VisitStatus.FINISHED : VisitStatus.USING,
		visitedAt,
		departedAt: isFinished ? departedAt : null,
		duration: isFinished ? duration : null,
		notes: faker.datatype.boolean(SEED_CONFIG.PROBABILITIES.VISIT_NOTES)
			? faker.lorem.sentence()
			: null,
	};
};

interface MenuItem {
	id: string;
	price: number;
}

const generateOrder = (restaurantId: string, visit: Visit) => {
	const status =
		visit.status === VisitStatus.FINISHED
			? faker.datatype.boolean(
					SEED_CONFIG.PROBABILITIES.ORDER_COMPLETED_IF_VISIT_FINISHED,
				)
				? OrderStatus.COMPLETED
				: OrderStatus.CANCELLED
			: randomElement([
					OrderStatus.PENDING,
					OrderStatus.PREPARING,
					OrderStatus.COMPLETED,
					OrderStatus.CANCELLED,
				]);

	return {
		restaurantId,
		visitId: visit.id,
		status,
		note: faker.datatype.boolean(SEED_CONFIG.PROBABILITIES.ORDER_NOTES)
			? faker.lorem.sentence()
			: null,
	};
};

const generateOrderItem = (order: Order, menu: MenuItem) => ({
	orderId: order.id,
	menuId: menu.id,
	quantity: randomInt(
		SEED_CONFIG.ORDER_ITEM_COUNTS.MIN,
		SEED_CONFIG.ORDER_ITEM_COUNTS.MAX,
	),
	price: menu.price,
	note: faker.datatype.boolean(SEED_CONFIG.PROBABILITIES.ORDER_ITEM_NOTES)
		? faker.lorem.sentence()
		: null,
});

async function main() {
	console.log('Starting database seeding...');

	// Clear existing data
	console.log('Clearing existing data...');
	await prisma.$transaction([
		prisma.restaurantUser.deleteMany(),
		prisma.orderItem.deleteMany(),
		prisma.order.deleteMany(),
		prisma.visit.deleteMany(),
		prisma.pricePlanMenu.deleteMany(),
		prisma.pricePlan.deleteMany(),
		prisma.menu.deleteMany(),
		prisma.table.deleteMany(),
		prisma.restaurant.deleteMany(),
		prisma.user.deleteMany(),
	]);

	// Create users (2 admins, 100 regular users)
	console.log('Creating users...');
	const admins = await prisma.user.createManyAndReturn({
		data: Array.from({ length: SEED_CONFIG.USER_COUNTS.ADMIN }, (_, i) =>
			generateUser(i, UserRole.ADMIN),
		),
	});

	const users = await prisma.user.createManyAndReturn({
		data: Array.from({ length: SEED_CONFIG.USER_COUNTS.REGULAR }, (_, i) =>
			generateUser(i, UserRole.USER),
		),
	});

	const allUsers = [...admins, ...users];
	console.log(
		`Successfully created ${allUsers.length} users (${admins.length} admins, ${users.length} users)`,
	);

	// Create restaurants
	console.log('Creating restaurants...');
	const restaurants = await prisma.restaurant.createManyAndReturn({
		data: Array.from({ length: SEED_CONFIG.RESTAURANT_COUNT }, (_, i) =>
			generateRestaurant(i),
		),
	});
	console.log(`Successfully created ${restaurants.length} restaurants`);

	// Create each restaurant data
	for (const restaurant of restaurants) {
		console.log(`Creating data for ${restaurant.name}...`);

		const randomUsers = randomElements(
			allUsers,
			randomInt(
				SEED_CONFIG.RESTAURANT_USER_COUNTS.MIN,
				SEED_CONFIG.RESTAURANT_USER_COUNTS.MAX,
			),
		);
		const managerCount = randomInt(
			SEED_CONFIG.RESTAURANT_USER_COUNTS.MANAGER_MIN,
			SEED_CONFIG.RESTAURANT_USER_COUNTS.MANAGER_MAX,
		);

		await prisma.restaurantUser.createMany({
			data: randomUsers.map((user, index) => ({
				restaurantId: restaurant.id,
				userId: user.id,
				role:
					index < managerCount
						? RestaurantUserRole.MANAGER
						: RestaurantUserRole.STAFF,
			})),
		});

		const menus = await prisma.menu.createManyAndReturn({
			data: Array.from(
				{
					length: randomInt(
						SEED_CONFIG.MENU_COUNTS.MIN,
						SEED_CONFIG.MENU_COUNTS.MAX,
					),
				},
				(_, i) => generateMenu(restaurant.id, i),
			),
		});

		const tables = await prisma.table.createManyAndReturn({
			data: Array.from(
				{
					length: randomInt(
						SEED_CONFIG.TABLE_COUNTS.MIN,
						SEED_CONFIG.TABLE_COUNTS.MAX,
					),
				},
				(_, i) => generateTable(restaurant.id, i),
			),
		});

		const pricePlanCount = randomInt(
			SEED_CONFIG.PRICE_PLAN_COUNTS.MIN,
			SEED_CONFIG.PRICE_PLAN_COUNTS.MAX,
		);
		const hasBuffet = faker.datatype.boolean(
			SEED_CONFIG.PROBABILITIES.HAS_BUFFET_PRICE_PLAN,
		);

		const pricePlans = await prisma.pricePlan.createManyAndReturn({
			data: Array.from({ length: pricePlanCount }, (_, i) =>
				// Only one price plan can be non-buffet
				generatePricePlan(restaurant.id, i, hasBuffet ? i !== 0 : false),
			),
		});

		for (const table of tables) {
			const visitTimes = faker.date.betweens({
				from: SEED_CONFIG.DATE_RANGES.VISIT_FROM,
				to: SEED_CONFIG.DATE_RANGES.VISIT_TO,
				count: randomInt(
					SEED_CONFIG.VISIT_COUNTS.MIN,
					SEED_CONFIG.VISIT_COUNTS.MAX,
				),
			});

			const visits = await prisma.visit.createManyAndReturn({
				data: visitTimes.map((date, index) =>
					generateVisit(
						restaurant.id,
						table,
						randomElement(pricePlans),
						date,
						visitTimes[index + 1] || new Date(),
					),
				),
			});

			const orders = await prisma.order.createManyAndReturn({
				data: visits.flatMap((visit) => {
					const orderCount = randomInt(
						SEED_CONFIG.ORDER_COUNTS.MIN,
						SEED_CONFIG.ORDER_COUNTS.MAX,
					);
					return Array.from({ length: orderCount }, () =>
						generateOrder(restaurant.id, visit),
					);
				}),
			});

			await prisma.orderItem.createMany({
				data: orders.flatMap((order) => {
					const itemCount = randomInt(
						SEED_CONFIG.ORDER_ITEM_COUNTS.MIN,
						SEED_CONFIG.ORDER_ITEM_COUNTS.MAX,
					);
					const menuPool = randomElements(menus, itemCount);
					return menuPool.map((menu) => generateOrderItem(order, menu));
				}),
			});
		}

		console.log(`Completed setup for ${restaurant.name}`);
	}

	console.log('Database seeding completed successfully!');
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
