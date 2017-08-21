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

	let credential = null;

	credential = localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY) ||
		Cookie.get(REQUEST_TOKEN_STORAGE_KEY) || null;

	return JSON.parse(credential);
}

export function setRequestCredential(credential) {
	localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(credential));
	Cookie.set(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(credential));
}

export function removeRequestCredential() {
	localStorage.removeItem(REQUEST_TOKEN_STORAGE_KEY);
	Cookie.remove(REQUEST_TOKEN_STORAGE_KEY);
}
