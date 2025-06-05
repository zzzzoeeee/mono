import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Prisma } from '@prisma-client';
import { Response } from 'express';

// Some part of code in this file are
// from https://gist.github.com/rajibkuet07/22ff7a4e7f189e7fc4e1bbfd0747fd86

export const HTTP_CODE_FROM_PRISMA: Record<
	string,
	{ status: number; message: string }
> = {
	// operation time out
	P1008: {
		status: HttpStatus.REQUEST_TIMEOUT,
		message: 'Request timeout',
	},
	// too long input
	P2000: { status: HttpStatus.BAD_REQUEST, message: 'Input Data is too long' },
	// searched entity not exists
	P2001: { status: HttpStatus.NO_CONTENT, message: 'Record does not exist' },
	// unique constraint or duplication
	P2002: {
		status: HttpStatus.CONFLICT,
		message: 'Reference Data already exists',
	},
	// foreign key constraint
	P2003: {
		status: HttpStatus.UNPROCESSABLE_ENTITY,
		message: 'The provided input can not be processed',
	},
	P2014: {
		status: HttpStatus.UNPROCESSABLE_ENTITY,
		message: 'The provided input can not be processed',
	},
	// update entity not found
	P2016: {
		status: HttpStatus.NOT_FOUND,
		message: 'The entity to update does not exist',
	},
	// out of range
	P2020: {
		status: HttpStatus.UNPROCESSABLE_ENTITY,
		message: 'The provided input can not be processed',
	},
	// internal server error
	P2021: {
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		message: 'Internal server error',
	},
	// not found error
	P2025: {
		status: HttpStatus.NOT_FOUND,
		message: 'The queried entity does not exist',
	},
};

@Catch(
	Prisma.PrismaClientInitializationError,
	Prisma.PrismaClientValidationError,
	Prisma.PrismaClientKnownRequestError,
	Prisma.PrismaClientUnknownRequestError,
	Prisma.PrismaClientRustPanicError,
)
export class PrismaClientExceptionFilter<
	T extends
		| Prisma.PrismaClientInitializationError
		| Prisma.PrismaClientValidationError
		| Prisma.PrismaClientKnownRequestError
		| Prisma.PrismaClientUnknownRequestError
		| Prisma.PrismaClientRustPanicError,
> implements ExceptionFilter
{
	catch(exception: T, host: ArgumentsHost) {
		const ctx: HttpArgumentsHost = host.switchToHttp();

		let statusCode: HttpStatus;
		let message: string;

		if (
			'code' in exception &&
			exception.code &&
			HTTP_CODE_FROM_PRISMA?.[exception.code]
		) {
			const mapper = HTTP_CODE_FROM_PRISMA[exception.code];
			statusCode = mapper.status;
			message = mapper.message;
		} else {
			statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
			message = 'Internal server error';
		}

		this.response(statusCode, message, ctx.getResponse());
	}

	private response(
		statusCode: HttpStatus,
		message: string,
		response: Response,
	) {
		response.status(statusCode).json({
			statusCode,
			message,
		});
	}
}
