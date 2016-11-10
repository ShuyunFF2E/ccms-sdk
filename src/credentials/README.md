# credentials 证书相关 API

* get credentials 获取证书

  ES6
  	
  	```js
  	import getRequestCredential from 'ccms-sdk/credentials';
      	
    console.log(getRequestCredential());
  	```
  	
  	ES5
  	
    ```js
    angular.module('app', ['ccms.sdk'])
  		.controller('$ccmsAuth', function($ccmsAuth) {
			console.log($ccmsAuth.getRequestCredential());
		});
    ```

