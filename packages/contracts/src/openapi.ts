import { c } from './contracts';
import { generateOpenApi } from '@ts-rest/open-api';
import express from 'express';
import * as swaggerUi from 'swagger-ui-express';

const app = express();
const port = 3100;

const openApiDocument = generateOpenApi(c, {
	info: {
		title: 'Restaurants API',
		version: '1.0.0',
	},
	servers: [
		{
			url: 'http://localhost:3000',
			description: 'Local API server',
		},
	],
});

app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
