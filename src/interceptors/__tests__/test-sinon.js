/*
*  @qix
* */

import sinon from 'sinon';
import JQuery from 'jquery';
import {assert} from 'chai';

describe('test sinon', function() {

	// fake server
	let fServer;

	beforeEach(function() {
		fServer = sinon.fakeServer.create();
		fServer.respondWith('GET', '/test/1',
			[200, {'Content-Type': 'application/json'}, '{"name": "qix"}']);
	});

	afterEach(function() {
		fServer.restore();
	});

	it('should reponse as preset.', function() {
		let callback = sinon.spy();

		JQuery.ajax({
			url: '/test/1',
			success: callback
		});

		fServer.respond();

		assert.equal(callback.calledWith({name: 'qix'}), true);
	})
});


