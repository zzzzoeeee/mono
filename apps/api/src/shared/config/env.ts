import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
	PORT: z.preprocess(Number, z.number().optional().default(3000)),
	DATABASE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

export default env;
