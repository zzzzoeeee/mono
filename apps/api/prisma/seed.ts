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
const generateUser = (index: number, role: UserRole) => ({
	email: `${role === UserRole.ADMIN ? 'admin' : 'user'}${index}@example.com`,
	password:
		'$argon2id$v=19$m=65536,t=3,p=4$X40vXI3KUvJojm7XmEseag$kQ5EyaFjUV9D7L+dzsWhO/Ldy+eILhTduw1iP3shhqw', // hashed 'password123'
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
		price: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
		category: randomElement(menuCategories),
		isAvailable: faker.datatype.boolean(0.9),
		image: `https://picsum.photos/seed/menu-${index}/400/300`,
	};
};

const generateTable = (restaurantId: string, index: number) => ({
	restaurantId,
	name: `Table ${index + 1}`,
	capacity: randomInt(2, 8),
	isActive: faker.datatype.boolean(0.9),
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
		? faker.number.float({ min: 179, max: 2000, fractionDigits: 2 })
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
	const duration = randomInt(30, 240);
	const isFinished = faker.datatype.boolean(0.7);
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
		notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
	};
};

interface MenuItem {
	id: string;
	price: number;
}

const generateOrder = (restaurantId: string, visit: Visit) => {
	const status =
		visit.status === VisitStatus.FINISHED
			? faker.datatype.boolean(0.95)
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
		note: faker.datatype.boolean(0.1) ? faker.lorem.sentence() : null,
	};
};

const generateOrderItem = (order: Order, menu: MenuItem) => ({
	orderId: order.id,
	menuId: menu.id,
	quantity: randomInt(1, 4),
	price: menu.price,
	note: faker.datatype.boolean(0.1) ? faker.lorem.sentence() : null,
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
		data: Array.from({ length: 2 }, (_, i) => generateUser(i, UserRole.ADMIN)),
	});

	const users = await prisma.user.createManyAndReturn({
		data: Array.from({ length: 100 }, (_, i) => generateUser(i, UserRole.USER)),
	});

	const allUsers = [...admins, ...users];
	console.log(
		`Successfully created ${allUsers.length} users (${admins.length} admins, ${users.length} users)`,
	);

	// Create restaurants
	console.log('Creating restaurants...');
	const restaurants = await prisma.restaurant.createManyAndReturn({
		data: Array.from({ length: 3 }, (_, i) => generateRestaurant(i)),
	});
	console.log(`Successfully created ${restaurants.length} restaurants`);

	// Create each restaurant data
	for (const restaurant of restaurants) {
		console.log(`Creating data for ${restaurant.name}...`);

		const randomUsers = randomElements(allUsers, randomInt(5, 20));
		const managerCount = randomInt(1, 2);

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
			data: Array.from({ length: randomInt(20, 100) }, (_, i) =>
				generateMenu(restaurant.id, i),
			),
		});

		const tables = await prisma.table.createManyAndReturn({
			data: Array.from({ length: randomInt(4, 20) }, (_, i) =>
				generateTable(restaurant.id, i),
			),
		});

		const pricePlanCount = randomInt(2, 5);
		const hasBuffet = faker.datatype.boolean(0.7);

		const pricePlans = await prisma.pricePlan.createManyAndReturn({
			data: Array.from({ length: pricePlanCount }, (_, i) =>
				// Only one price plan can be non-buffet
				generatePricePlan(restaurant.id, i, hasBuffet ? i !== 0 : false),
			),
		});

		for (const table of tables) {
			const visitTimes = faker.date.betweens({
				from: '2025-01-01',
				to: new Date(),
				count: randomInt(10, 100),
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
					const orderCount = randomInt(1, 5);
					return Array.from({ length: orderCount }, () =>
						generateOrder(restaurant.id, visit),
					);
				}),
			});

			await prisma.orderItem.createMany({
				data: orders.flatMap((order) => {
					const itemCount = randomInt(1, 5);
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
