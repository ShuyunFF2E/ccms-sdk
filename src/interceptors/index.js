/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-12
 */

import angular from 'angular';

import tokenRefreshInterceptor, {
	getRequestCredential,
	setRequestCredential,
	setAuthFailedBehavior,
	setRefreshTokenUrl
} from './token-refresh-interceptor';

export default angular
	.module('ccms.utils.interceptors', [])
	.constant('ccmsTokenRefreshInterceptor', tokenRefreshInterceptor)
	.constant('$ccmsRefreshToken', {
		getRequestCredential,
		setRequestCredential,
		setAuthFailedBehavior,
		setRefreshTokenUrl
	})
	.name;
