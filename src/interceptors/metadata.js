/**
 * @author qix
 * @homepage https://github.com/qixman/
 * @since 2016-10-21
 */

export const Date = window.Date;
export const noop = () => {};
export const REQUEST_TOKEN_HEADER = 'Authorization';
export const REQUEST_TOKEN_VALUE = value => `Bearer ${value}`;
export const USER_SESSION_AVAILABLE_TIME = 30 * 60 * 1000;
export const REQUEST_WHITE_LIST = [];
export const CREDENTIAL_KEY_MAPPER = {
	accessToken: 'access_token',
	refreshToken: 'refresh_token',
	expireTime: 'expire_time'
};
