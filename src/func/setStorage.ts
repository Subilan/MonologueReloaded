import { LOCALSTORAGE_PREFIX } from "@/consts";

export default function setStorage(key: string, value: string) {
    localStorage.setItem(LOCALSTORAGE_PREFIX + key, value);
}