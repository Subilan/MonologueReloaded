interface OkResponse<T = any> {
	status: 'ok';
	data: T;
}

interface NgResponse {
	status: 'ng' | 'error';
	message: string;
}

export type Resp<T = any> = OkResponse<T> | NgResponse;
