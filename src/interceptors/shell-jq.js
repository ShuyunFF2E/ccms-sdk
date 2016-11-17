/**
 * @author shuyun
 * @homepage http://github.com/qixman
 * @date 2016/11/16
 */
/**
 * @author qix
 * @homepage https://github.com/qixman/
 * @since 2016-11-16
 */

import tokenRefreshInterceptorJq from './token-refresh-interceptor-jq';
import { setRefreshTokenUrl, setAuthFailedBehavior } from './token-refresh-interceptor';
import { getRequestCredential, setRequestCredential } from '../credentials';

// 为es5提供调用
if (!window.ccmsSdk) window.ccmsSdk = {};
Object.assign(window.ccmsSdk, {
	tokenRefreshInterceptor: tokenRefreshInterceptorJq,
	$ccmsAuth: {
		setAuthFailedBehavior,
		setRefreshTokenUrl,
		getRequestCredential,
		setRequestCredential
	}
});
