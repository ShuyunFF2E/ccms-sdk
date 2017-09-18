/**
 * @author qix
 * @homepage https://github.com/qixman/
 * @since 2016-10-11
 */
import { getRequestCredential, setRequestCredential } from '../credentials';
import {
	CREDENTIAL_KEY_MAPPER,
	Date,
	REQUEST_TOKEN_HEADER,
	REQUEST_TOKEN_VALUE,
	REQUEST_WHITE_LIST,
	USER_SESSION_AVAILABLE_TIME
} from './metadata';
import { execAuthFailure, refreshTokenUrl } from './token-refresh-interceptor';

let needToRefreshToken = false;

export default {

	beforeSend: function(xhr, config) {

		const credential = getRequestCredential();
		const { accessToken, refreshToken, clientAccessTime } = CREDENTIAL_KEY_MAPPER;
		if (!credential) {
			execAuthFailure(xhr);
			return;
		}

		xhr.setRequestHeader(REQUEST_TOKEN_HEADER, REQUEST_TOKEN_VALUE(credential[accessToken]));
		xhr[REQUEST_TOKEN_HEADER] = REQUEST_TOKEN_VALUE(credential[accessToken]);
		if (credential[refreshToken] && REQUEST_WHITE_LIST.indexOf(config.url) === -1) {

			// expireTime type is second
			// const expireDateTime = credential[expireTime] * 1000;
			const clientAccessTimeDate = credential[clientAccessTime] + (USER_SESSION_AVAILABLE_TIME * 2);
			const now = Date.now();

			// token失效则直接跳转登录页面
			// token未失效但是可用时长已低于用户会话最短保留时间,则需要刷新token
			if (USER_SESSION_AVAILABLE_TIME >= clientAccessTimeDate - now && clientAccessTimeDate - now >= 0) {
				needToRefreshToken = true;
			} else if (clientAccessTimeDate - now < 0) { // token失效
				execAuthFailure(xhr);
			}
		}

	},
	complete: function(xhr) {

		// 如果请求能正常响应,说明 storage 里的状态是存在的,所以这里不做判断
		const credential = getRequestCredential();
		const { accessToken, refreshToken } = CREDENTIAL_KEY_MAPPER;
		const $ = window.$;

		// 所有请求结束了才做refreshToken的操作,避免后端因为token被刷新而导致前一请求失败
		if (needToRefreshToken && $.active <= 1) {
			needToRefreshToken = false;
			// refresh token
			$.ajax({
				url: refreshTokenUrl,
				type: 'POST',
				data: {
					refresh_token: credential[refreshToken],
					grant_type: 'refresh_token'
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					[REQUEST_TOKEN_HEADER]: REQUEST_TOKEN_VALUE(credential[accessToken])
				}
			}).done(response => {
				// 更新localStorage中token信息
				setRequestCredential(response, Date.now());
			}).fail(() => execAuthFailure(xhr));
		}

	}
};
