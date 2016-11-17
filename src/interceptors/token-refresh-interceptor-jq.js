/**
 * @author qix
 * @homepage https://github.com/qixman/
 * @since 2016-10-11
 */
import { getRequestCredential, setRequestCredential, removeRequestCredential } from '../credentials';
import { Date, REQUEST_TOKEN_HEADER } from './interceptor-metadata';

const USER_SESSION_AVAILABLE_TIME = 30 * 60 * 1000;
const REQUEST_WHITE_LIST = [];

let needToRefreshToken = false;
let execAuthFailure = () => {
	return () => {};
};
export function setAuthFailedBehavior(fn = execAuthFailure) {
	execAuthFailure = jqXHR => {
		return () => {
			try {
				fn();
			} finally {
				removeRequestCredential();
			}
			const ex = new TypeError('credential was expired or had been removed, pls set it before the get action!');
			console.error(ex);
			jqXHR.abort(ex);
		};
	};
}

let refreshTokenUrl = '';
export function setRefreshTokenUrl(url) {
	refreshTokenUrl = url;
	REQUEST_WHITE_LIST.push(url);
}

export default {
	beforeSend: function(xhr, config) {
		const credential = getRequestCredential();
		if (!credential) {
			execAuthFailure(xhr)();
			return;
		}

		xhr.setRequestHeader(REQUEST_TOKEN_HEADER, credential.id);
		xhr[REQUEST_TOKEN_HEADER] = credential.id;
		if (credential.refreshToken && REQUEST_WHITE_LIST.indexOf(config.url) === -1) {

			const expireTime = Date.parse(credential.expireTime);
			const now = Date.now();

			// token失效则直接跳转登录页面
			// token未失效但是可用时长已低于用户会话最短保留时间,则需要刷新token
			if (USER_SESSION_AVAILABLE_TIME >= expireTime - now && expireTime - now >= 0) {
				needToRefreshToken = true;
			} else if (expireTime - now < 0) { // token失效
				execAuthFailure(xhr)();
				return;
			}
		}
	},
	complete: function(xhr) {
		// 如果请求能正常响应,说明 storage 里的状态是存在的,所以这里不做判断
		const credential = getRequestCredential();
		const $ = window.$;

		// 所有请求结束了才做refreshToken的操作,避免后端因为token被刷新而导致前一请求失败
		if (needToRefreshToken && $.active <= 1) {
			needToRefreshToken = false;
			xhr[REQUEST_TOKEN_HEADER] = credential.id;
			// refresh token
			$.ajax({
				url: refreshTokenUrl,
				method: 'PUT',
				data: credential.refreshToken,
				headers: {[REQUEST_TOKEN_HEADER]: credential.id}
			}).done(response => {
				// 更新localStorage中token信息
				setRequestCredential(JSON.parse(response));
			}).fail(execAuthFailure(xhr));
		}
	}
};


