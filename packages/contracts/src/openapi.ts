import { c } from './contracts';
import { generateOpenApi } from '@ts-rest/open-api';
import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

type SecurityRequirementObject = {
	[name: string]: string[];
};

const app = express();
const port = 3100;

const hasSecurity = (
	metadata: unknown,
): metadata is {
	openApiSecurity: SecurityRequirementObject[];
} => {
	return (
		!!metadata && typeof metadata === 'object' && 'openApiSecurity' in metadata
	);
};

const openApiDocument = generateOpenApi(
	c,
	{
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
		components: {
			securitySchemes: {
				cookieAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'mono_session',
					description:
						'Session cookie authentication. Can also use `/auth/login`',
				},
			},
		},
	},
	{
		setOperationId: true,
		operationMapper: (operation, appRoute) => ({
			...operation,

			...(hasSecurity(appRoute.metadata)
				? {
						security: appRoute.metadata.openApiSecurity,
					}
				: {}),
		}),
	},
);

const theme = new SwaggerTheme();

app.use('/openapi', (req, res) => {
	res.json(openApiDocument);
});

app.use(
	'/',
	swaggerUi.serve,
	swaggerUi.setup(openApiDocument, {
		customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
		swaggerOptions: {
			persistAuthorization: true,
			withCredentials: true,
			requestInterceptor: (req: RequestInit) => {
				req.credentials = 'include';
				return req;
			},
		},
	}),
);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
