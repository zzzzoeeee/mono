import { z } from 'zod';

export const zodBooleanString = z.preprocess(
	(val) => {
		const value = String(val).toLowerCase();
		return value === 'true' ? true : value === 'false' ? false : undefined;
	},
	z.boolean({
		message: 'Boolean string (true or false)',
	}),
);
