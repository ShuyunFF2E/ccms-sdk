/**
 * @author JOCS
 */
import { getRequestCredential, removeRequestCredential, setRequestCredential } from '../credentials';
import qs from 'querystring';

import {
	Date,
	noop,
	requestCount,
	CREDENTIAL_KEY_MAPPER,
	REQUEST_TOKEN_HEADER,
	REQUEST_TOKEN_VALUE,
	REQUEST_WHITE_LIST,
	USER_SESSION_AVAILABLE_TIME
} from './metadata';

let needToRefreshToken = false;

let execAuthFailure = noop;
export function setAuthFailedBehavior(fn = noop) {

	execAuthFailure = rejection => {

		try {
			fn();
		} finally {
			removeRequestCredential();
		}

		const ex = new TypeError(
			'Unauthorized! Credential was expired or had been removed,' +
			'pls set it before the get action!'
		);
		console.error(ex);

		rejection.status = rejection.status || 401;
		rejection.statusText = rejection.statusText || 'Unauthorized!';
		return Promise.reject(rejection);
	};
}

let refreshTokenUrl = '';
export function setRefreshTokenUrl(url) {
	refreshTokenUrl = url;
	REQUEST_WHITE_LIST.push(url);
}

const initInterceptor = http => {
	// 定义interceptor
	const interceptors = {
		requestErr(error) {
			http[requestCount]++;
			return Promise.reject(error);
		},
		request(config) {
			http[requestCount]++;
			const credential = getRequestCredential();

			const { accessToken, refreshToken, clientAccessTime } = CREDENTIAL_KEY_MAPPER;
			// storage 里的状态有可能已经失效
			if (!credential) {
				return execAuthFailure({config});
			}

			config.headers[REQUEST_TOKEN_HEADER] = REQUEST_TOKEN_VALUE(credential[accessToken]);
			// console.log(JSON.stringify(config, null, 4));
			// console.log(credential, null, 4);
			// 白名单之外的url做校验
			// TODO 兼容处理,如果拿不到refreshToken说明系统还未升级,则不做刷新token逻辑
			if (credential[refreshToken] && REQUEST_WHITE_LIST.indexOf(config.url) === -1) {


				// expireTime type is second
				// const expireDateTime = credential[expireTime] * 1000;
				const clientAccessTimeDate = credential[clientAccessTime] + (USER_SESSION_AVAILABLE_TIME * 2);
				const now = Date.now();

				// token失效则直接跳转登录页面
				// token未失效但是可用时长已低于用户会话最短保留时间,则需要刷新token
				if (USER_SESSION_AVAILABLE_TIME >= clientAccessTimeDate - now && clientAccessTimeDate - now >= 0) {
					needToRefreshToken = true;
				} else if (clientAccessTimeDate - now < 0) {
					// token失效
					console.log('expired');
					return execAuthFailure({config});
				}
			}

			return config;
		},

		response(response) {

			http[requestCount]--;
			// 如果请求能正常响应,说明 storage 里的状态是存在的,所以这里不做判断
			const credential = getRequestCredential();
			const { accessToken, refreshToken } = CREDENTIAL_KEY_MAPPER;

			// 所有请求结束了才做refreshToken的操作,避免后端因为token被刷新而导致前一请求失败
			if (needToRefreshToken && http[requestCount] <= 0) {
				needToRefreshToken = false;
				// refresh token
				http
					.post(refreshTokenUrl, qs.stringify({ 'refresh_token': credential[refreshToken], 'grant_type': 'refresh_token' }), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							[REQUEST_TOKEN_HEADER]: REQUEST_TOKEN_VALUE(credential[accessToken])
						}
					})
					.then(res => {
						// console.log(JSON.stringify(res.data, null, 4));
						// 更新localStorage中token信息
						setRequestCredential(res.data, Date.now());
					})
					.catch(rejection => {
						// console.error(rejection);
						execAuthFailure(rejection);
					});
			}

			return response;
		},

		responseErr(error) {
			http[requestCount]--;
			return Promise.reject(error);
		}

	};

	const { request, response, requestErr, responseErr } = interceptors;

	http[requestCount] = 0;

	http.interceptors.request.use(request, requestErr);
	http.interceptors.response.use(response, responseErr);

};

export default initInterceptor;
