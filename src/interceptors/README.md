# interceptors

* token-refresh-interceptor

	根据当前token状态自动刷新token
	
	ES6
	
   	```js
	import angular from 'angular';
	import tokenRefreshInterceptor, { setAuthFailedBehavior, setRefreshTokenUrl, setRequestCredential } from 'ccms-sdk/interceptors/token-refresh-interceptor';
	
	setRequestCredential({} // your token);
	setRefreshTokenUrl('https://api.xx.com/xx/xx');
	setAuthFailedBehavior(() => location.href = 'login.html');
	
	angular.module('app', [])
		.config(['$httpProvider', $httpProvider => $httpProvider.interceptors.push(() => tokenRefreshInterceptor)]);
	```
   	
   	ES5
   	
   	```js
   	angular.module('app', [])
		.config(['$httpProvider', 'ccmsTokenRefreshInterceptor', '$ccmsRefreshToken', function($httpProvider, ccmsTokenRefreshInterceptor, $ccmsRefreshToken) {

			$ccmsRefreshToken.setRequestCredential({} // your token);
			// 设定刷新token的接口url
			$ccmsRefreshToken.setRefreshTokenUrl('https://api.xx.com/xx/xx');
			// 设定认证失败后的逻辑(比如页面跳转等)
			$ccmsRefreshToken.setAuthFailedBehavior(function() {
				// ...do something like location redirect
			});
			$httpProvider.interceptors.push(function() {
		 		return ccmsTokenRefreshInterceptor;
		 	})];
		 });
   	```