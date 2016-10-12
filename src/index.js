/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-02
 */

import angular from 'angular';

import interceptors, {ccmsTokenRefreshInterceptorJq, setAuthFailedBehaviorJq} from './interceptors';

export default angular
	.module('ccms.sdk', [
		interceptors
	])
	.name;

export {ccmsTokenRefreshInterceptorJq, setAuthFailedBehaviorJq};
