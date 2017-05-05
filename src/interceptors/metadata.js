/**
 * @author qix
 * @homepage https://github.com/qixman/
 * @since 2016-10-21
 */

export const Date = window.Date;
export const REQUEST_TOKEN_HEADER = 'X-TOKEN';
export const USER_SESSION_AVAILABLE_TIME = 30 * 60 * 1000;
export const REQUEST_WHITE_LIST = [];
export const CREDENTIAL_KEY_MAPPER = {
	accessToken: 'access_token',
	refreshToken: 'refresh_token',
	expireTime: 'expire_time'
};
