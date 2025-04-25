import { COOKIE_PREFIX } from '@/consts';
import Cookies from 'js-cookie';

export default function setCookie(name: string, value: string) {
    Cookies.set(COOKIE_PREFIX + name, value);
}
