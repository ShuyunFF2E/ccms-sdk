/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-29
 */
import Cookie from 'js-cookie';

const localStorage = window.localStorage;
const JSON = window.JSON;

let REQUEST_TOKEN_STORAGE_KEY = 'ccmsRequestCredential';
export function setTokenKey(key) {
	REQUEST_TOKEN_STORAGE_KEY = key;
}

export function getRequestCredential() {

	let credential = null;
	// get credential from cookie when inside an iframe
	if (window.self !== window.top) {
		credential = Cookie.get(REQUEST_TOKEN_STORAGE_KEY) || null;
	} else {
		credential = localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY) || null;
	}

	return JSON.parse(credential);
}

export function setRequestCredential(credential, client_access_time) {
	credential['client_access_time'] = client_access_time || Date.now();
	localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(credential));
	Cookie.set(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(credential));
}

export function removeRequestCredential() {
	localStorage.removeItem(REQUEST_TOKEN_STORAGE_KEY);
	Cookie.remove(REQUEST_TOKEN_STORAGE_KEY);
}
