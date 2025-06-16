import { User } from '../../modules/user/types';
import { Request } from 'express';

export type ReqWithUser = Request & {
	user?: User;
};
