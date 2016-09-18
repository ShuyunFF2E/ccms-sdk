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

#### ES6 (直接使用包模块)

```js
import angular from 'angular';
import tokenRefreshInterceptor from 'ccms-sdk/interceptors/token-refresh-interceptor';

angular.module('app', [])
	.config(['$httpProvider', $httpProvider => $httpProvider.interceptors.push(() => tokenRefreshInterceptor)])
```

#### ES5 (依赖 ccms.sdk 模块)

```html
<script src="../node_modules/ccms-sdk/es5/ccms-sdk.js"></script>
```

```js
angular.module('app', ['ccms.sdk'])
```

#### API List
* [interceptors](interceptors)
	
