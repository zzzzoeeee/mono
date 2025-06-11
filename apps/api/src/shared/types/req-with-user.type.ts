import { User } from '../../modules/user/types';

export type ReqWithUser = Request & {
	user?: User;
};
