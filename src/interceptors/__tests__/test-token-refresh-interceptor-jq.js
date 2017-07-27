/*
 *  @qix
 * */
import sinon from 'sinon';
import JQuery from 'jquery';
import { assert } from 'chai';
import tokenRefreshInterceptor from '../token-refresh-interceptor-jq';
import { setAuthFailedBehavior, setRefreshTokenUrl } from '../token-refresh-interceptor';
import { getRequestCredential, setRequestCredential } from '../../credentials';
import { CREDENTIAL_KEY_MAPPER, REQUEST_TOKEN_HEADER as tokenHeader, REQUEST_TOKEN_VALUE } from '../metadata';

describe('token refresh interceptor -jq version', function() {

	window.$ = JQuery;
	const fServer = sinon.fakeServer.create();
	const sandbox = sinon.sandbox.create();

	const queryResponse = { name: 'kuitos' };
	const queryResponse1 = { name: 'qix' };
	const queryResponse2 = { name: 'heyman' };
	const { accessToken, refreshToken, expireTime } = CREDENTIAL_KEY_MAPPER;

	fServer.restore = function() {
		this.responses = [];
	};

	JQuery.ajaxSetup(tokenRefreshInterceptor);

	beforeEach(function() {
		fServer.respondWith('GET', '/test/1',
			[200, { 'Content-Type': 'application/json' }, JSON.stringify(queryResponse)]);
		fServer.respondWith('GET', '/test/2',
			[200, { 'Content-Type': 'application/json' }, JSON.stringify(queryResponse1)]);
		fServer.respondWith('GET', '/test/3',
			[200, { 'Content-Type': 'application/json' }, JSON.stringify(queryResponse2)]);

		window.self = window.top;

	});

	afterEach(function() {
		fServer.restore();
	});

	it('should\'t do anything expect Authorization header setting in old system which has no refreshToken prop in storage.', function() {
		const token = {
			[accessToken]: '123456',
			[expireTime]: '1473753990'
		};

		setRequestCredential(token);

		const [spy1, spy2] = [
			sandbox.spy((response, status, xhr) => {
				assert.deepEqual(response, queryResponse);
				assert.equal(xhr[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));
			}),
			sandbox.spy((response, status, xhr) => {
				assert.deepEqual(response, queryResponse1);
				assert.equal(xhr[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));
			})
		];
		JQuery.get('/test/1').done(spy1);
		JQuery.get('/test/2').done(spy2);

		fServer.respond();

		assert.equal(spy1.callCount, 1);
		assert.equal(spy2.callCount, 1);
	});

	it('should call the fialed behavior when token had expired', () => {
		const token = {
			[accessToken]: '123456',
			[expireTime]: '1473753990',
			[refreshToken]: '12345678890'
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

		fServer.respond();
	});

	describe('token not expired but have keeping over 30 minute', () => {

		let spy;

		const token = {
			[accessToken]: '123456',
			[expireTime]: '1473753990',
			[refreshToken]: '12345678890'
		};

		const newToken = 'xxxxxxxxxx';
		const refreshTokenUrl = '/test/refreshToken';

		const originalNow = Date.now;

		beforeEach(() => {

			Date.now = () => token[expireTime] * 1000 - 10 * 60 * 1000;
			setRequestCredential(token);
			setRefreshTokenUrl(refreshTokenUrl);

			spy = sandbox.spy(() => {
				return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ ...token, ...{ [accessToken]: newToken } })];
			});

			fServer.respondWith('put', refreshTokenUrl, request => {
				if (request.requestHeaders[tokenHeader] === getRequestCredential()[accessToken]) {
					request.respond(...spy());
					return;
				}
				request.respond('hello');
			});
		});

		afterEach(() => {
			Date.now = originalNow;
		});

		it('token should be refresh in storage but not reflect the request immediately', () => {
			JQuery.get('/test/1').done((res, status, xhr) => {
				assert.equal(xhr[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));
			});
			JQuery.get('/test/2').done((res, status, xhr) => {
				assert.equal(xhr[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));
			});

			// 此处多次调用respond，是因为上面的请求callback中包含了新的请求
			// 此处这个新的请求为拦截器中的put请求，用来执行刷新token操作
			// 下同
			fServer.respond();
			fServer.respond();

			assert.equal(spy.callCount, 1);
			assert.equal(getRequestCredential()[accessToken], newToken);

			JQuery.get('/test/1').done((res, status, xhr) => {
				assert.equal(xhr[tokenHeader], REQUEST_TOKEN_VALUE(newToken));
			});

			fServer.respond();
			fServer.respond();

		});

		it('call redirect action when refresh api invoked failed', () => {
			fServer.respondWith('put', refreshTokenUrl, [401, {}, '']);

			const spy = sandbox.spy();
			setAuthFailedBehavior(spy);

			JQuery.get('/test/3');
			fServer.respond();
			fServer.respond();

			assert.equal(spy.callCount, 1);
			assert.equal(getRequestCredential(), null);
		});
	});
});


