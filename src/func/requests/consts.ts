const API_GLOBAL_PREFIX = '';
const API_USER_GROUP_PREFIX = API_GLOBAL_PREFIX + '/user';

export namespace RequestErrors {
	export const ERR_INVALID_BODY = 'invalid body';
	export const ERR_DUPLICATE_KEY = 'duplicated key';
	export const ERR_NOT_FOUND = 'not found';
	export const ERR_INCORRECT_INFO = 'incorrect info';
}

export namespace RequestApis {
    export const CREATE_USER = API_USER_GROUP_PREFIX + '/create';
    export const CHECK_USER = API_USER_GROUP_PREFIX + '/check';
}


export const RET_OK = {
	ok: true,
	data: null
} as const;

export const RET_NG = (data: string) => {
	return {
		ok: false,
		data
	} as const;
};
