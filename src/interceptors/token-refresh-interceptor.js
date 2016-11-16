/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-09
 */

import injector from 'angular-es-utils/injector';
import { getRequestCredential, setRequestCredential, removeRequestCredential } from '../credentials';
import { Date, REQUEST_TOKEN_HEADER } from './metadata';

const USER_SESSION_AVAILABLE_TIME = 30 * 60 * 1000;
const REQUEST_WHITE_LIST = [];

let needToRefreshToken = false;
let execAuthFailure = function() {};

export function setAuthFailedBehavior(fn = execAuthFailure) {

	execAuthFailure = rejection => {

		try {
			fn();
		} finally {
			removeRequestCredential();
		}

		const ex = new TypeError('Unauthorized! Credential was expired or had been removed, pls set it before the get action!');
		console.error(ex);

		rejection.status = rejection.status || 401;
		rejection.statusText = rejection.statusText || 'Unauthorized!';
		return injector.get('$q').reject(rejection);
	};
}

let refreshTokenUrl = '';
export function setRefreshTokenUrl(url) {
	refreshTokenUrl = url;
	REQUEST_WHITE_LIST.push(url);
}

export default {

	request(config) {

		const credential = getRequestCredential();
		// storage 里的状态有可能已经失效
		if (!credential) {
			return execAuthFailure({config});
		}

		config.headers[REQUEST_TOKEN_HEADER] = credential.id;

		// 白名单之外的url做校验
		// TODO 兼容处理,如果拿不到refreshToken说明系统还未升级,则不做刷新token逻辑
		if (credential.refreshToken && REQUEST_WHITE_LIST.indexOf(config.url) === -1) {

			const expireTime = Date.parse(credential.expireTime);
			const now = Date.now();

			// token失效则直接跳转登录页面
			// token未失效但是可用时长已低于用户会话最短保留时间,则需要刷新token
			if (USER_SESSION_AVAILABLE_TIME >= expireTime - now && expireTime - now >= 0) {
				needToRefreshToken = true;
			} else if (expireTime - now < 0) { // token失效
				return execAuthFailure({config});
			}
		}

		return config;
	},

	response(response) {

		// 如果请求能正常响应,说明 storage 里的状态是存在的,所以这里不做判断
		const credential = getRequestCredential();

		const $http = injector.get('$http');
		// 所有请求结束了才做refreshToken的操作,避免后端因为token被刷新而导致前一请求失败
		if (needToRefreshToken && $http.pendingRequests.length === 0) {

			needToRefreshToken = false;
			// refresh token
			$http.put(refreshTokenUrl, credential.refreshToken, {headers: {[REQUEST_TOKEN_HEADER]: credential.id}})
				.then(response => {
					// 更新localStorage中token信息
					setRequestCredential(response.data);
				}, execAuthFailure);
		}

		return response;
	}

};
