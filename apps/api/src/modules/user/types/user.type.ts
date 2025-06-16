export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';

export type User = {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
};

export type UserWithPassword = User & {
	password: string;
};

export type CreateUserInput = Omit<
	User,
	'id' | 'createdAt' | 'updatedAt' | 'role'
> & {
	hashedPassword: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;
