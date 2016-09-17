# ccms sdk

[![Build Status](https://img.shields.io/travis/ShuyunFF2E/ccms-sdk.svg?style=flat-square)](https://travis-ci.org/ShuyunFF2E/ccms-sdk)
[![npm version](https://img.shields.io/npm/v/ccms-sdk.svg?style=flat-square)](https://www.npmjs.com/package/ccms-sdk)
[![npm downloads](https://img.shields.io/npm/dt/ccms-sdk.svg?style=flat-square)](https://www.npmjs.com/package/ccms-sdk)
[![coverage](https://img.shields.io/codecov/c/github/ShuyunFF2E/ccms-sdk.svg?style=flat-square)](https://codecov.io/gh/ShuyunFF2E/ccms-sdk)

## How To Use

### Install

```shell
npm i ccms-sdk --save
```

### Usage

#### ES5

```html
<script src="../node_modules/ccms-sdk/ccms-sdk.js"></script>
```

```js
angular.module('app', ['ccms.sdk'])
```

#### ES6

```js
import angular from 'angular';
import tokenRefreshInterceptor from 'ccms-sdk/interceptors/token-refresh-interceptor';

angular.module('app', [])
	.config(['$httpProvider', $httpProvider => $httpProvider.interceptors.push(() => tokenRefreshInterceptor)])
```

#### API List
* interceptors
	* token-refresh-interceptor  
		根据当前token状态自动刷新token的拦截器
		
		```js
		import angular from 'angular';
		import tokenRefreshInterceptor from 'ccms-sdk/interceptors/token-refresh-interceptor';

		angular.module('app', [])
			.config(['$httpProvider', $httpProvider => $httpProvider.interceptors.push(() => tokenRefreshInterceptor)])
		```
