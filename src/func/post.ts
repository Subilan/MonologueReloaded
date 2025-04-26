import { API_ENDPOINT } from '@/consts';
import type { Resp } from '@/models/Response';
import axios, { AxiosHeaders, type RawAxiosRequestHeaders } from 'axios';

export default async function post<T = any>(target: string, data: any, headers: RawAxiosRequestHeaders | AxiosHeaders = {}) {
	return axios.post<Resp<T>>(API_ENDPOINT + target, data, {
		headers,
		validateStatus: status => (status >= 200 && status < 300) || status === 400 || status === 500
	});
}
