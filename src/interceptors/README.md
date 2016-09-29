# interceptors

* token-refresh-interceptor

	根据当前token状态自动刷新token
	
	ES6
	
   	```js
	import angular from 'angular';
	import tokenRefreshInterceptor, { setAuthFailedBehavior, setRefreshTokenUrl } from 'ccms-sdk/interceptors/token-refresh-interceptor';
	import { setRequestCredential } from 'ccms-sdk/credentials';
	
	setRequestCredential({} // your token);
	setRefreshTokenUrl('https://api.xx.com/xx/xx');
	setAuthFailedBehavior(() => location.href = 'login.html');
	
	angular.module('app', [])
		.config(['$httpProvider', $httpProvider => $httpProvider.interceptors.push(() => tokenRefreshInterceptor)]);
	```
   	
   	ES5
   	
   	```js
   	angular.module('app', [])
		.config(['$httpProvider', 'ccmsTokenRefreshInterceptor', '$ccmsAuth', function($httpProvider, ccmsTokenRefreshInterceptor, $ccmsAuth) {

			$ccmsAuth.setRequestCredential({} // your token);
			// 设定刷新token的接口url
			$ccmsAuth.setRefreshTokenUrl('https://api.xx.com/xx/xx');
			// 设定认证失败后的逻辑(比如页面跳转等)
			$ccmsAuth.setAuthFailedBehavior(function() {
				// ...do something like location redirect
			});
			$httpProvider.interceptors.push(function() {
		 		return ccmsTokenRefreshInterceptor;
		 	});
		 });
   	```
