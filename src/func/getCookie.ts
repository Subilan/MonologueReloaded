import { COOKIE_PREFIX } from '@/consts';
import Cookies from 'js-cookie';

export default function getCookie(name: string, defaultValue: string = '') {
    return Cookies.get(COOKIE_PREFIX + name) || defaultValue;
}
