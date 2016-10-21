/*
 *  @qix
 * */

import sinon from 'sinon';
import JQuery from 'jquery';
import {assert} from 'chai';

describe('token refresh interceptor -jq version', function() {

	const $ = JQuery;
	// fake server
	let fServer = sinon.fakeServer.create();

	const queryResponse = {name: 'kuitos'};
	const queryResponse1 = {name: 'qix'};

	beforeEach(function() {
		fServer.respondWith('GET', '/test/1',
			[200, {'Content-Type': 'application/json'}, JSON.stringify(queryResponse)]);
		fServer.respondWith('GET', '/test/2',
			[200, {'Content-Type': 'application/json'}, JSON.stringify(queryResponse1)]);
	});

	afterEach(function() {
		fServer.restore();
	});

	it('should\'t do anything expect X-TOKEN header setting in old system which has no refreshToken prop in storage.', function() {

		$.get('/test/1').then(response => {
			assert.deepEqual(response, queryResponse);
		});

		fServer.respond();
	});
});


