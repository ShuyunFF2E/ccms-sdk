/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-29
 */

import Cookie from 'js-cookie';

const localStorage = window.localStorage;
const JSON = window.JSON;

const REQUEST_TOKEN_STORAGE_KEY = 'ccmsRequestCredential';

export function getRequestCredential() {
	return JSON.parse(localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY) || Cookie.get(REQUEST_TOKEN_STORAGE_KEY) || null);
}

export function setRequestCredential(credential) {
	localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(credential));
}

export function removeRequestCredential() {
	localStorage.removeItem(REQUEST_TOKEN_STORAGE_KEY);
	Cookie.remove(REQUEST_TOKEN_STORAGE_KEY);
}
