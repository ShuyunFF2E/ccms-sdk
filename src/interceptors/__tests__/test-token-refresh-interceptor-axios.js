/*
 *  @JOCS
 * */
import sinon from 'sinon';
import axios from 'axios';
import moxios from 'moxios';
import { assert } from 'chai';
import initIntercpter from '../token-refresh-interceptor-axios';
import { setAuthFailedBehavior, setRefreshTokenUrl } from '../token-refresh-interceptor-axios';
import { getRequestCredential, setRequestCredential } from '../../credentials';
import { CREDENTIAL_KEY_MAPPER, REQUEST_TOKEN_HEADER as tokenHeader, REQUEST_TOKEN_VALUE } from '../metadata';

describe('token refresh interceptor -axios version', function() {

	const http = axios.create({
		baseURL: '/',
		headers: { 'Cache-Control': 'no-cache' }
	});

	initIntercpter(http);

	const sandbox = sinon.sandbox.create();

	const queryResponse = { name: 'kuitos' };
	const queryResponse1 = { name: 'qix' };
	const queryResponse2 = { name: 'heyman' };

	const { accessToken, refreshToken, expireTime } = CREDENTIAL_KEY_MAPPER;


	beforeEach(function() {
		moxios.uninstall();
		moxios.install(http);

		moxios.stubRequest('/test/1', {
			status: 200,
			response: queryResponse
		});

		moxios.stubRequest('/test/2', {
			status: 200,
			response: queryResponse1
		});

		moxios.stubRequest('/test/3', {
			status: 200,
			response: queryResponse2
		});

		window.self = window.top;


	});

	afterEach(function() {
		moxios.uninstall();
	});

	it('should\'t do anything expect Authorization header setting in old system which has no refreshToken prop in storage.', function(done) {
		const token = {
			[accessToken]: '123456',
			[expireTime]: '1473753990'
		};

		setRequestCredential(token);


		const [spy1, spy2] = [
			sandbox.spy(),
			sandbox.spy()
		];

		http.get('/test/1').then(spy1);
		http.get('/test/2').then(spy2);

		moxios.wait(function() {
			let response1 = spy1.getCall(0).args[0];
			assert.deepEqual(response1.data, queryResponse);
			assert.equal(response1.config.headers[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));

			let response2 = spy2.getCall(0).args[0];
			assert.deepEqual(response2.data, queryResponse1);
			assert.equal(response2.config.headers[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));

			assert.equal(spy1.callCount, 1);
			assert.equal(spy2.callCount, 1);
			done();
		});
	});

	it('should call the fialed behavior when token had expired', done => {
		const token = {
			[accessToken]: '123456',
			[expireTime]: '1473753990',
			[refreshToken]: '12345678890'
		};

		setRequestCredential(token);

		const spy = sandbox.spy();
		setAuthFailedBehavior(spy);

		const [spy1, spy2] = [
			sandbox.spy(),
			sandbox.spy()
		];

		http.get('/test/1').catch(spy1);

		http.get('/test/2').catch(spy2);

		moxios.wait(function() {

			let response1 = spy1.getCall(0).args[0];
			// console.log(JSON.stringify(response1, null, 4));
			assert.equal(response1.status, 401);
			assert.equal(response1.statusText, 'Unauthorized!');

			let response2 = spy2.getCall(0).args[0];
			assert.equal(response2.status, 401);
			assert.equal(response2.statusText, 'Unauthorized!');


			assert.equal(spy.callCount, 2);
			assert.equal(getRequestCredential(), null);
			done();
		});
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

			spy = sandbox.spy(() => Object.assign({}, token, { [accessToken]: newToken }));

		});

		afterEach(() => {
			Date.now = originalNow;
		});

		it('token should be refresh in storage but not reflect the request immediately', done => {

			const [spy1, spy2] = [
				sandbox.spy(),
				sandbox.spy()
			];
			moxios.stubRequest(refreshTokenUrl, {
				status: 200,
				response: spy()
			});

			http.get('/test/1').then(spy1);
			http.get('/test/2').then(spy2);

			// 此处多次调用respond，是因为上面的请求callback中包含了新的请求
			// 此处这个新的请求为拦截器中的put请求，用来执行刷新token操作
			// 下同
			moxios.wait(function() {
				assert.equal(spy.callCount, 1);
				assert.equal(getRequestCredential()[accessToken], newToken);

				const response1 = spy1.getCall(0).args[0];
				assert.equal(response1.config.headers[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));


				let response2 = spy2.getCall(0).args[0];
				// console.log(JSON.stringify(response2, null, 4));
				assert.equal(response2.config.headers[tokenHeader], REQUEST_TOKEN_VALUE(token[accessToken]));

				http.get('/test/1').then(res => {
					assert.equal(res.config.headers[tokenHeader], REQUEST_TOKEN_VALUE(newToken));
					done();
				});
			});

		});

		it('call redirect action when refresh api invoked failed', done => {
			moxios.stubRequest(refreshTokenUrl, {
				status: 401,
				response: ''
			});

			const spy = sandbox.spy();
			setAuthFailedBehavior(spy);

			http.get('/test/3');

			moxios.wait(function() {
				assert.equal(spy.callCount, 1);
				assert.equal(getRequestCredential(), null);
				done();
			});

		});
	});
});


