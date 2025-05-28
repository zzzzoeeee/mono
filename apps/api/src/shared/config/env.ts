import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	PORT: z.preprocess(Number, z.number().optional().default(3000)),
	DATABASE_URL: z.string().url(),
	CORS_ORIGINS: z.preprocess(
		(s) => (typeof s === 'string' ? s.split(',') : undefined),
		z.array(z.string().url()).optional(),
	),
});

const env = envSchema.parse(process.env);

export default env;
