import type ExtUser from '@/models/ExtUser';
import type { Feedback } from '@/types';
import post from '../post';
import { RequestApis, RET_NG, RET_OK } from './consts';

export default async function createUser(user: ExtUser): Feedback {
	const result = await post(RequestApis.CREATE_USER, user);

	if (result.data.status !== 'ok') {
		return RET_NG(result.data.message);
	}

	return RET_OK;
}
