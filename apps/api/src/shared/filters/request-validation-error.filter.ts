import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { commonResponses } from '@repo/contracts';
import { RequestValidationError } from '@ts-rest/nest';
import { Response } from 'express';
import { z } from 'zod';

const STATUS_CODE = 400;
type BadRequestResponseType = z.infer<(typeof commonResponses)['400']>;

@Catch(RequestValidationError)
export class RequestValidationErrorFilter implements ExceptionFilter {
	catch(exception: RequestValidationError, host: ArgumentsHost) {
		const ctx: HttpArgumentsHost = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const errorData: BadRequestResponseType = {
			statusCode: STATUS_CODE,
			message: 'Validation error',
			detail: exception.getResponse(),
		};

		response.status(errorData.statusCode).json(errorData);
	}
}
