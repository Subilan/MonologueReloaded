import { API_ENDPOINT } from '@/consts';
import type { Resp } from '@/models/Response';
import axios from 'axios';

export default async function get<T = any>(target: string) {
	return axios.get<Resp<T>>(API_ENDPOINT + target);
}
