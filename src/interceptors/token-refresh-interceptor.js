/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-09
 */

import injector from 'angular-es-utils/injector';

const localStorage = window.localStorage;
const Date = window.Date;
const JSON = window.JSON;

const REQUEST_TOKEN_HEADER = 'X-TOKEN';
const USER_SESSION_AVAILABLE_TIME = 30 * 60 * 1000;
const REQUEST_WHITE_LIST = [];

let needToRefreshToken = false;

export const REQUEST_TOKEN_STORAGE_KEY = 'ccmsRequestCredential';

let redirectToLogin = () => {
};
export function setAuthFailedBehavior(fn) {
	redirectToLogin = fn;
}

let refreshTokenUrl = '';
export function setRefreshTokenUrl(url) {
	refreshTokenUrl = url;
	REQUEST_WHITE_LIST.push(url);
}

export default {

	request(config) {

		const ccmsRequestCredential = JSON.parse(localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY));

		config.headers[REQUEST_TOKEN_HEADER] = ccmsRequestCredential.id;

		// 白名单之外的url做校验
		// TODO 兼容处理,如果拿不到refreshToken说明系统还未升级,则不做刷新token逻辑
		if (ccmsRequestCredential.refreshToken && REQUEST_WHITE_LIST.indexOf(config.url) === -1) {

			const expireTime = Date.parse(ccmsRequestCredential.expireTime);
			const now = Date.now();

			// token失效则直接跳转登录页面
			// token未失效但是可用时长已低于用户会话最短保留时间,则需要刷新token
			if (USER_SESSION_AVAILABLE_TIME >= expireTime - now && expireTime - now >= 0) {
				needToRefreshToken = true;
			} else if (expireTime - now < 0) { // token失效
				redirectToLogin();
			}
		}

		return config;
	},

	response(response) {

		const ccmsRequestCredential = JSON.parse(localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY));

		const $http = injector.get('$http');
		// 所有请求结束了才做refreshToken的操作,避免后端因为token被刷新而导致前一请求失败
		if (needToRefreshToken && $http.pendingRequests.length === 0) {

			needToRefreshToken = false;
			// refresh token
			$http.put(refreshTokenUrl, ccmsRequestCredential.refreshToken)
				.then(response => {
					// 更新localStorage中token信息
					localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(response.data));
				}, redirectToLogin);
		}

		return response;
	}

};
