// /**
//  * @author Kuitos
//  * @homepage https://github.com/kuitos/
//  * @since 2016-10-12
//  */
//
// import angular from 'angular';
// import sinon from 'sinon';
// import { assert } from 'chai';
// import injector from 'angular-es-utils/injector';
//
// import apiRequestPrefixInterceptor, { setApiRequestPrefix } from '../api-request-prefix-interceptor';
//
// describe('token refresh interceptor', () => {
//
// 	let $http, $httpBackend;
// 	const sandbox = sinon.sandbox.create();
// 	const prefix = 'http://xx/xx/xx';
// 	const staticRequest = '/test/a.html';
// 	const domainApiRequest = 'http://xx.xx.com/test/a.html';
// 	setApiRequestPrefix(prefix);
//
// 	beforeEach(() => {
//
// 		angular
// 			.module('app', [])
// 			.config(['$httpProvider', $httpProvider => {
// 				$httpProvider.interceptors.push(() => apiRequestPrefixInterceptor);
// 			}]);
//
// 		angular.mock.module('app');
// 		angular.mock.inject((_$http_, _$q_, _$httpBackend_, _$injector_) => {
// 			$http = _$http_;
// 			$httpBackend = _$httpBackend_;
// 			angular.element(document.body).data('$injector', _$injector_);
// 			sandbox.stub(injector, 'get', _$injector_.get);
// 		});
//
// 		$httpBackend.whenGET(prefix + '/test/1').respond(200);
// 		$httpBackend.whenGET(staticRequest).respond(200);
// 		$httpBackend.whenGET(domainApiRequest).respond(200);
// 	});
//
// 	afterEach(() => {
// 		sandbox.restore();
// 	});
//
// 	it('dynamic api request should be prefixed', () => {
//
// 		$http.get('/test/1').then(response => {
// 			assert.equal(response.config.url, prefix + '/test/1');
// 		});
//
// 		$httpBackend.flush();
//
// 	});
//
// 	it('static file request should not be prefixed', () => {
//
// 		$http.get('/test/a.html').then(response => {
// 			assert.equal(response.config.url, '/test/a.html');
// 		});
//
// 		$httpBackend.flush();
// 	});
//
// 	it('api request which fulfill domain should not be prefixed', () => {
//
// 		$http.get(domainApiRequest).then(response => {
// 			assert.equal(response.config.url, domainApiRequest);
// 		});
//
// 		$httpBackend.flush();
// 	});
//
// });
