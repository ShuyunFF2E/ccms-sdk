# interceptors

## api-request-prefix-interceptor
	
对 API 接口(区别于静态文件ajax请求)请求加前缀的拦截器
	
> 提示：由于 CORS 限制，跨域请求想携带当前域的 cookie 信息需对请求设置 withCredentials:true
	
ES6
	
```js
import angular from 'angular';
import apiRequestPrefixInterceptor, { setApiRequestPrefix } from 'ccms-sdk/interceptors/api-request-prefix-interceptor';
	
setApiRequestPrefix('http://ual.api.com'); // 注意：请根据不同环境打包成不同前缀配置
    
angular.module('app', [])
	.config(['$httpProvider', $httpProvider => $httpProvider.interceptors.push(() => apiRequestPrefixInterceptor)]);
```
	
ES5
	
```js
angular.module('app', [])
	.config(['$httpProvider', 'apiRequestPrefixInterceptor', function($httpProvider, apiRequestPrefixInterceptor) {
    
		apiRequestPrefixInterceptor.setApiRequestPrefix('http://ual.api.com');
		$httpProvider.interceptors.push(function() {
			return apiRequestPrefixInterceptor.origin;
		});
	}]);
```

## token-refresh-interceptor

根据当前token状态自动刷新token拦截器
	
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
[demo](../../examples/interceptors.html)
   	
## token-refresh-interceptor-jq

token-refresh-interceptor的jq版本，为了兼容使用jq ajax进行http请求的情况。
	
ES6
	
```js
import $ from 'jquery';
import { setAuthFailedBehavior, setRefreshTokenUrl } from 'ccms-sdk/interceptors/token-refresh-interceptor';
import tokenRefreshInterceptor from 'ccms-sdk/interceptors/token-refresh-interceptor-jq';
import { setRequestCredential } from 'ccms-sdk/credentials';
	
$.ajaxSetup(tokenRefreshInterceptor);
	
setRequestCredential({} // your token);
setRefreshTokenUrl('https://api.xx.com/xx/xx');
setAuthFailedBehavior(() => location.href = 'login.html');
```
	
ES5
	
```html
<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../es5/interceptor-jq.min.js"></script>
...
```
	
```js
var ccmsSdk = window.ccmsSdk,
$ccmsAuth = ccmsSdk.$ccmsAuth;
    
$ccmsAuth.setRequestCredential({} // your token);
$ccmsAuth.setRefreshTokenUrl('https://api.xx.com/xx/xx');
$ccmsAuth.setAuthFailedBehavior(function(){
	// ...do something like location redirect
});
    
$.ajaxSetup(ccmsSdk.tokenRefreshInterceptor);
```
   	
[demo](../../examples/interceptors-jq.html)
