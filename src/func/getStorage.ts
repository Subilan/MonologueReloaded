import { LOCALSTORAGE_PREFIX } from "@/consts";

export default function getStorage(key: string, defaultVal: string = '') {
    const res = localStorage.getItem(LOCALSTORAGE_PREFIX + key);
    return res || defaultVal;
}