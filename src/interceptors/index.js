/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-12
 */

import angular from 'angular';

import tokenRefreshInterceptor, { setAuthFailedBehavior, setRefreshTokenUrl } from './token-refresh-interceptor';
import tokenRefreshInterceptorJq, { setAuthFailedBehaviorJq } from './token-refresh-interceptor-jq';
import { getRequestCredential, setRequestCredential } from '../credentials';

export {tokenRefreshInterceptorJq as ccmsTokenRefreshInterceptorJq, setAuthFailedBehaviorJq};
export default angular
	.module('ccms.utils.interceptors', [])
	.constant('ccmsTokenRefreshInterceptor', tokenRefreshInterceptor)
	.constant('$ccmsAuth', {
		getRequestCredential,
		setRequestCredential,
		setAuthFailedBehavior,
		setRefreshTokenUrl
	})
	.name;
