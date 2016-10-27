/*
 *  @qix
 * */

import sinon from 'sinon';
import JQuery from 'jquery';
import {assert} from 'chai';

import tokenRefreshInterceptor, { setAuthFailedBehavior, setRefreshTokenUrl } from '../token-refresh-interceptor-jq';
import { getRequestCredential, setRequestCredential } from '../../credentials';

describe('token refresh interceptor -jq version', function() {

	const fServer = sinon.fakeServer.create();
	const sandbox = sinon.sandbox.create();

	const queryResponse = {name: 'kuitos'};
	const queryResponse1 = {name: 'qix'};
	const tokenHeader = 'X-TOKEN';

	beforeEach(function() {
		JQuery.ajaxSetup(tokenRefreshInterceptor);
		fServer.respondWith('GET', '/test/1',
			[200, {'Content-Type': 'application/json'}, JSON.stringify(queryResponse)]);
		fServer.respondWith('GET', '/test/2',
			[200, {'Content-Type': 'application/json'}, JSON.stringify(queryResponse1)]);
	});

	afterEach(function() {
		fServer.restore();
	});

	it('should\'t do anything expect X-TOKEN header setting in old system which has no refreshToken prop in storage.', function() {
		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+08:00'
		};

		setRequestCredential(token);

		JQuery.get('/test/1').then(response => {
			assert.deepEqual(response, queryResponse);
		});

		fServer.respond();
	});

	it('should call the fialed behavior when token had expired', () => {
		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+08:00',
			refreshToken: '12345678890'
		};

		setRequestCredential(token);

		const spy = sandbox.spy();
		setAuthFailedBehavior(spy);

		JQuery.get('/test/1').fail((xhr, status, e) => {
			assert.instanceOf(e, TypeError);
			assert.equal(getRequestCredential(), null);
		});

		JQuery.get('/test/2').fail((xhr, status, e) => {
			assert.instanceOf(e, TypeError);
			assert.equal(spy.callCount, 2);
			assert.equal(getRequestCredential(), null);
		});
	});

	describe('token not expired but have keeping over 30 minute', () => {

		let spy;
		// let fakeXHR = sinon.useFakeXMLHttpRequest();
		// let requestHandler;

		const token = {
			id: '123456',
			expireTime: '2016-09-13T16:06:30.886+08:00',
			refreshToken: '12345678890'
		};

		const newToken = 'xxxxxxxxxx';
		const refreshTokenUrl = '/test/refreshToken';

		const originalNow = Date.now;

		beforeEach(() => {

			// fakeXHR.onCreate = xhr => {
			// 	if (xhr.method === 'put') requestHandler = xhr;
			// };

			Date.now = () => Date.parse(token.expireTime) - 10 * 60 * 1000;
			setRequestCredential(token);
			setRefreshTokenUrl(refreshTokenUrl);

			spy = sandbox.spy(() => {
				return [200, {...token, ...{id: newToken}}];
			});

			fServer.respondWith('put', refreshTokenUrl, request => {
				// requestHandler = request;
				if (request.headers[tokenHeader] === getRequestCredential().id) {
					request.respond(spy);
				}
			});
		});

		afterEach(() => {
			Date.now = originalNow;
		});

		it('token should be refresh in storage but not reflect the request immediately', () => {
			JQuery.get('/test/1').then(response => {
				assert.equal(response.config.headers[tokenHeader], token.id);
			});
			JQuery.get('/test/2').then(response => {
				assert.equal(response.config.headers[tokenHeader], token.id);
			});

			fServer.respond();

			assert.equal(spy.callCount, 1);
			assert.equal(getRequestCredential().id, newToken);

			JQuery.get('/test/1').then(response => {
				assert.equal(response.config.headers[tokenHeader], newToken);
			});

			fServer.respond();

		});

		it('call redirect action when refresh api invoked failed', () => {
			// requestHandler.respond(401);

			const spy = sandbox.spy();
			setAuthFailedBehavior(spy);

			JQuery.get('/test/1');
			fServer.respond();
            //
			// assert.equal(spy.callCount, 1);
			// assert.equal(getRequestCredential(), null);
		});

		it('there is a window with document', () => {
			assert.isNotNull(window);
		});
	});
});


