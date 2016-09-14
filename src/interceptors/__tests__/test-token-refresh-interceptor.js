/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-13
 */

import angular from 'angular';
import sinon from 'sinon';
import { assert } from 'chai';
import injector from 'angular-es-utils/injector';

import tokenRefreshInterceptor, {
	REQUEST_TOKEN_STORAGE_KEY,
	setAuthFailedBehavior,
	setRefreshTokenUrl
} from '../token-refresh-interceptor';

const localStorage = window.localStorage;

describe('token refresh interceptor', () => {

	let $http, $q, $httpBackend;
	const sandbox = sinon.sandbox.create();

	const queryResponse = {name: 'kuitos'};
	const queryResponse1 = {name: 'kuitosx'};

	beforeEach(() => {

		angular
			.module('app', [])
			.config(['$httpProvider', $httpProvider => {
				$httpProvider.interceptors.push(() => tokenRefreshInterceptor);
			}]);

		angular.mock.module('app');
		angular.mock.inject((_$http_, _$q_, _$httpBackend_, _$injector_) => {
			$http = _$http_;
			$q = _$q_;
			$httpBackend = _$httpBackend_;
			angular.element(document.body).data('$injector', _$injector_);
			sandbox.stub(injector, 'get', _$injector_.get);
		});

		$httpBackend.whenGET('/test/1').respond(200, queryResponse);
		$httpBackend.whenGET('/test/2').respond(200, queryResponse1);

	});

	afterEach(() => {
		sandbox.restore();
		localStorage.removeItem(REQUEST_TOKEN_STORAGE_KEY);
	});

	it('should\'t do anything expect X-TOKEN header setting in old system which has no refreshToken prop in storage', done => {

		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+0800'
		};

		localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(token));

		$q.all([$http.get('/test/1'), $http.get('/test/2')]).then(response => {
			const [responseA, responseB] = response;
			assert.deepEqual(queryResponse, responseA.data);
			assert.deepEqual(queryResponse1, responseB.data);

			assert.equal(responseA.config.headers['X-TOKEN'], token.id);
			assert.equal(responseB.config.headers['X-TOKEN'], token.id);

			done();
		});

		$httpBackend.flush();
	});

	it('should call the failed behavior when token had expired', () => {

		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+0800',
			refreshToken: '12345678890'
		};

		localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(token));

		const spy = sandbox.spy();
		setAuthFailedBehavior(spy);

		$http.get('/test/1');
		$http.get('/test/2');
		$httpBackend.flush();

		assert.equal(spy.callCount, 2);
	});

	describe('token not expired but have keeping over 30 minute', () => {

		let requestHandler, spy;
		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+0800',
			refreshToken: '12345678890'
		};
		const newToken = 'xxxxxxxxxx';
		const refreshTokenUrl = '/test/refreshToken';

		const originalNow = Date.now();
		beforeEach(() => {
			Date.now = () => Date.parse(token.expireTime) - 10 * 60 * 1000;
			localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(token));
			setRefreshTokenUrl(refreshTokenUrl);

			spy = sandbox.spy(() => {
				return [200, {...token, ...{id: newToken}}];
			});
			requestHandler = $httpBackend.whenPUT(refreshTokenUrl, token.refreshToken).respond(spy);
		});

		afterEach(() => {
			Date.now = originalNow;
		});

		it('token should be refresh in storage but not reflect the request immediately', () => {

			$http.get('/test/1').then(response => {
				assert.equal(response.config.headers['X-TOKEN'], token.id);
			});
			$http.get('/test/2').then(response => {
				assert.equal(response.config.headers['X-TOKEN'], token.id);
			});

			$httpBackend.flush();

			assert.equal(spy.callCount, 1);
			assert.equal(JSON.parse(localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY)).id, newToken);

			$http.get('/test/1').then(response => {
				assert.equal(response.config.headers['X-TOKEN'], newToken);
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
		});

	});

});

