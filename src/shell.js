/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-02
 * 为框架包装的外壳
 */

import angular from 'angular';

import interceptors from './interceptors/shell';

export default angular
	.module('ccms.sdk', [
		interceptors
	])
	.name;

