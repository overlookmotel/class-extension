/* --------------------
 * class-extension module
 * Tests for `extend` method
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

describe('`.extend()`', () => {
	it('returns subclass', () => {
		const extension = new Extension(InClass => class extends InClass {});
		const SubClass = Class.extend(extension);

		expect(SubClass).toBeDirectSubclassOf(Class);

		const instance = new SubClass();
		expect(instance).toBeInstanceOf(SubClass);
		expect(instance).toBeInstanceOf(Class);
	});

	it('can be called on subclass', () => {
		const extension1 = new Extension(InClass => class extends InClass {});
		const extension2 = new Extension(InClass => class extends InClass {});
		const SubClass = Class.extend(extension1);
		const SubSubClass = SubClass.extend(extension2);

		expect(SubSubClass).toBeDirectSubclassOf(SubClass);

		const instance = new SubSubClass();
		expect(instance).toBeInstanceOf(SubSubClass);
		expect(instance).toBeInstanceOf(SubClass);
		expect(instance).toBeInstanceOf(Class);
	});
});
