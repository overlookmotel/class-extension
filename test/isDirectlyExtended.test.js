/* --------------------
 * class-extension module
 * Tests for `isDirectlyExtended` methods
 * ------------------*/

'use strict';

// Modules
const {addMethodsToClass, Extension} = require('class-extension');

// Tests

let Class;
beforeEach(() => {
	Class = class {};
	addMethodsToClass(Class);
});

describe('`.isDirectlyExtended()` static method', () => {
	describe('returns true when some extensions applied and not subclassed after', () => {
		it('with one extension', () => {
			const extension = new Extension(InClass => class extends InClass {});
			const SubClass = Class.extend(extension);
			expect(SubClass.isDirectlyExtended()).toBeTrue();
		});

		it('with two extensions', () => {
			const extension1 = new Extension(InClass => class extends InClass {}),
				extension2 = new Extension(InClass => class extends InClass {});
			const SubClass = Class.extend(extension1).extend(extension2);
			expect(SubClass.isDirectlyExtended()).toBeTrue();
		});
	});

	describe('returns false when some extensions applied and not subclassed after', () => {
		describe('some extensions applied and subclassed after', () => {
			it('with one extension', () => {
				const extension = new Extension(InClass => class extends InClass {});
				const SubClass = Class.extend(extension);
				class SubSubClass extends SubClass {}
				expect(SubSubClass.isDirectlyExtended()).toBeFalse();
			});

			it('with two extensions', () => {
				const extension1 = new Extension(InClass => class extends InClass {}),
					extension2 = new Extension(InClass => class extends InClass {});
				const SubClass = Class.extend(extension1).extend(extension2);
				class SubSubClass extends SubClass {}
				expect(SubSubClass.isDirectlyExtended()).toBeFalse();
			});
		});

		it('no extensions applied', () => {
			expect(Class.isDirectlyExtended()).toBeFalse();
		});
	});
});
