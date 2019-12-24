/* --------------------
 * class-ext module
 * Tests
 * ------------------*/

'use strict';

// Modules
const classExt = require('../index');

// Init
require('./support');

// Tests

describe('tests', () => {
	it.skip('all', () => { // eslint-disable-line jest/no-disabled-tests
		expect(classExt).not.toBeUndefined();
	});
});
