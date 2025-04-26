export const COOKIE_PREFIX = '__monolg__cookie_';
export const LOCALSTORAGE_PREFIX = '__monolg__localstorage_';

export const API_ENDPOINT = 'http://localhost:9876';

export namespace RegexUtil{
    export const username = /^[0-9A-Za-z_-]{3,20}$/;
    export const usernameIndeterminate = /^.{3,20}$/;
    export const password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9@$!%*#?&+-\/\\\.\^\(\)\[\]]{8,}$/
    export const passwordIndeterminate = /^.{8,}$/;
}