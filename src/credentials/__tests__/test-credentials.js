/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-11-30
 */
import Cookie from 'js-cookie';
import { getRequestCredential } from '../index';
import { assert } from 'chai';

describe('credentials', () => {

	it('get credentials from iframe should works well', () => {

		const credentials = {name: 'kuitos'};
		Cookie.set('ccmsRequestCredential', JSON.stringify(credentials));

		assert.deepEqual(getRequestCredential(), credentials);
	});

});
