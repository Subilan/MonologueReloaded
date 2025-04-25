import { LOCALSTORAGE_PREFIX } from '@/consts';
import { useLocalStorage } from '@vueuse/core';

export default function useStorage(key: string, defaultVal: string = '') {
	return useLocalStorage(LOCALSTORAGE_PREFIX + key, () => defaultVal);
}
