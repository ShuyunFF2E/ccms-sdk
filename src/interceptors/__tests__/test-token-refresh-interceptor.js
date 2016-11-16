/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-13
 */

import angular from 'angular';
import sinon from 'sinon';
import { assert } from 'chai';
import injector from 'angular-es-utils/injector';

import tokenRefreshInterceptor, { setAuthFailedBehavior, setRefreshTokenUrl } from '../token-refresh-interceptor';
import { getRequestCredential, setRequestCredential } from '../../credentials';

describe('token refresh interceptor', () => {

	let $http, $q, $httpBackend, $rootScope;
	const sandbox = sinon.sandbox.create();

	const queryResponse = {name: 'kuitos'};
	const queryResponse1 = {name: 'kuitosx'};
	const tokenHeader = 'X-TOKEN';

	beforeEach(() => {

		angular
			.module('app', [])
			.config(['$httpProvider', $httpProvider => {
				$httpProvider.interceptors.push(() => tokenRefreshInterceptor);
			}]);

		angular.mock.module('app');
		angular.mock.inject((_$http_, _$q_, _$httpBackend_, _$injector_, _$rootScope_) => {
			$http = _$http_;
			$q = _$q_;
			$httpBackend = _$httpBackend_;
			$rootScope = _$rootScope_;
			angular.element(document.body).data('$injector', _$injector_);
			sandbox.stub(injector, 'get', _$injector_.get);
		});

		$httpBackend.whenGET('/test/1').respond(200, queryResponse);
		$httpBackend.whenGET('/test/2').respond(200, queryResponse1);

	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should\'t do anything expect X-TOKEN header setting in old system which has no refreshToken prop in storage', done => {

		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+08:00'
		};

		setRequestCredential(token);

		$q.all([$http.get('/test/1'), $http.get('/test/2')]).then(response => {
			const [responseA, responseB] = response;
			assert.deepEqual(queryResponse, responseA.data);
			assert.deepEqual(queryResponse1, responseB.data);

			assert.equal(responseA.config.headers[tokenHeader], token.id);
			assert.equal(responseB.config.headers[tokenHeader], token.id);

			done();
		});

		$httpBackend.flush();
	});

	it('should call the failed behavior when token had expired', () => {

		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+08:00',
			refreshToken: '12345678890'
		};

		setRequestCredential(token);

		const spy = sandbox.spy();
		setAuthFailedBehavior(spy);

		$http.get('/test/1').catch(rejection => {
			assert.equal(rejection.status, 401);
			assert.equal(rejection.statusText, 'Unauthorized!');
			assert.equal(getRequestCredential(), null);
		});

		$http.get('/test/2').catch(rejection => {
			assert.equal(rejection.status, 401);
			assert.equal(rejection.statusText, 'Unauthorized!');
			assert.equal(spy.callCount, 2);
			assert.equal(getRequestCredential(), null);
		});

		$rootScope.$digest();
	});

	describe('token not expired but have keeping over 30 minute', () => {

		let requestHandler, spy;
		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+08:00',
			refreshToken: '12345678890'
		};
		const newToken = 'xxxxxxxxxx';
		const refreshTokenUrl = '/test/refreshToken';

		const originalNow = Date.now;
		beforeEach(() => {
			Date.now = () => Date.parse(token.expireTime) - 10 * 60 * 1000;
			setRequestCredential(token);
			setRefreshTokenUrl(refreshTokenUrl);

			spy = sandbox.spy(() => {
				return [200, {...token, ...{id: newToken}}];
			});
			requestHandler = $httpBackend.whenPUT(refreshTokenUrl, token.refreshToken, headers => {
				return headers[tokenHeader] === getRequestCredential().id;
			}).respond(spy);
		});

		afterEach(() => {
			Date.now = originalNow;
		});

		it('token should be refresh in storage but not reflect the request immediately', () => {

			$http.get('/test/1').then(response => {
				assert.equal(response.config.headers[tokenHeader], token.id);
			});
			$http.get('/test/2').then(response => {
				assert.equal(response.config.headers[tokenHeader], token.id);
			});

			$httpBackend.flush();

			assert.equal(spy.callCount, 1);
			assert.equal(getRequestCredential().id, newToken);

			$http.get('/test/1').then(response => {
				assert.equal(response.config.headers[tokenHeader], newToken);
			});

			$httpBackend.flush();
		});

		it('call redirect action when refresh api invoked failed', () => {
			requestHandler.respond(401);

			const spy = sandbox.spy();
			setAuthFailedBehavior(spy);

			$http.get('/test/1');
			$httpBackend.flush();

			assert.equal(spy.callCount, 1);
			assert.equal(getRequestCredential(), null);
		});

	});

});

