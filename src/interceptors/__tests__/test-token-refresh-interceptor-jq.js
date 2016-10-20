// /**
//  * Created by Sadalsuud on 2016/10/11.
//  */
//
// import { env as jsdomEnv } from 'jsdom';
// import { assert } from 'chai';
// import jquery from 'jquery';
// import mockMaker from 'jquery-mockjax';
// import { XMLHttpRequest as XHR } from 'xmlhttprequest';
//
// // import tokenRefreshInterceptor, { setuthFiledBehavior, setRefreshTOkenUrl } from '../token-refresh-interceptor-jq';
// // import { getRequestCredential, setRequestCredential } from '../../credentials';
//
// describe('token refresh interceptor', () => {
// 	let $, $mock, win;
// 	const queryRes = 'test1';
// 	const queryRes2 = 'test2';
// //  const tokenHeader = 'X-TOKEN';
//
// 	const mockCfgs = [
// 		{
// 			url: '/test/1',
// 			status: 200,
// 			responseText: 'test1'
// 		}, {
// 			url: '/test/2',
// 			status: 200,
// 			responseText: 'test2'
// 		}
// 	];
//
// 	beforeEach(() => {
// 		jsdomEnv('<html></html>', (err, window) => {
// 			if (err) assert(false);
// 			else {
// 				win = window;
// 				$ = jquery(window);
//
// 				$.support.cors = true;
// 				$.ajaxSettings.xhr = () => new XHR();
// 				$mock = mockMaker($, win);
//
// 				$mock(mockCfgs[0]);
// 				$mock(mockCfgs[1]);
// 			}
// 		});
// 	});
//
// 	afterEach(() => {
// 		if ($mock) $mock.clear();
// 	});
//
// 	it('should return mock response', () => {
// 		$.ajax({
// 			url: '/test/1'
// 		}).success(res => { assert.equal(res, queryRes); });
//
// 		$.ajax({
// 			url: '/test/1',
// 			success: res => {
// 				assert.equal(res, queryRes2);
// 			}
// 		});
// 	});
//
// });
//
