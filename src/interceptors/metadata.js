/**
 * @author qix
 * @homepage https://github.com/qixman/
 * @since 2016-10-21
 */
import { getRequestCredential } from '../credentials';

const credential = getRequestCredential();

export const Date = window.Date;
export const noop = () => {};
export const requestCount = Symbol('REQUEST_COUNT');
export const REQUEST_TOKEN_HEADER = 'Authorization';
export const REQUEST_TOKEN_VALUE = value => `Bearer ${value}`;
// export const USER_SESSION_AVAILABLE_TIME = 30 * 60 * 1000;
export const USER_SESSION_AVAILABLE_TIME = (credential && credential['expires_in']) ? credential['expires_in'] * 1000 / 2 : 30 * 60 * 1000;
export const REQUEST_WHITE_LIST = [];
export const CREDENTIAL_KEY_MAPPER = {
	accessToken: 'access_token',
	refreshToken: 'refresh_token',
	expireTime: 'expire_time',
	clientAccessTime: 'client_access_time'
};
