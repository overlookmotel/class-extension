/* --------------------
 * class-extension module
 * Tests for `addMethodsToClass()`
 * ------------------*/

'use strict';

// Modules
const {addMethodsToClass} = require('class-extension');

// Tests

class Class {}
addMethodsToClass(Class);

describe('`addMethodsToClass()`', () => {
	describe('adds static methods', () => {
		it.each([
			'extend',
			'isExtendedWith',
			'getExtensions',
			'isDirectlyExtended'
		])('%s', (name) => {
			expect(Class[name]).toBeFunction();
		});
	});

	describe('adds prototype methods', () => {
		it.each([
			'isExtendedWith',
			'getExtensions',
			'isDirectlyExtended'
		])('%s', (name) => {
			expect(Class.prototype[name]).toBeFunction();
		});
	});
});
