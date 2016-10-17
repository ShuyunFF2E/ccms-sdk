/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-12
 */

import angular from 'angular';

import tokenRefreshInterceptor, { setAuthFailedBehavior, setRefreshTokenUrl } from './token-refresh-interceptor';
import tokenRefreshInterceptorJq, {setAuthFailedBehavior as setAuthFailedBehaviorJq, setRefreshTokenUrl as setRefreshTokenUrlJq} from './token-refresh-interceptor-jq';
import apiRequestPrefixInterceptor, { setApiRequestPrefix } from './api-request-prefix-interceptor';
import { getRequestCredential, setRequestCredential } from '../credentials';

export default angular
	.module('ccms.utils.interceptors', [])
	.constant('ccmsTokenRefreshInterceptor', tokenRefreshInterceptor)
	.constant('$ccmsAuth', {
		getRequestCredential,
		setRequestCredential,
		setAuthFailedBehavior,
		setRefreshTokenUrl
	})
	.constant('apiRequestPrefixInterceptor', {
		origin: apiRequestPrefixInterceptor,
		setApiRequestPrefix
	})
	.name;

// 为es5提供调用
if (!window.ccmsSdk) window.ccmsSdk = {};
Object.assign(window.ccmsSdk, {
	tokenRefreshInterceptor: tokenRefreshInterceptorJq,
	$ccmsAuth: {
		setAuthFailedBehavior: setAuthFailedBehaviorJq,
		setRefreshTokenUrl: setRefreshTokenUrlJq,
		getRequestCredential,
		setRequestCredential
	}
});
