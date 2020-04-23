/* --------------------
 * class-extension module
 * Tests for `classExtend` function
 * ------------------*/

'use strict';

// Modules
const {classExtend, Extension} = require('class-extension');

// Tests

describe('`.classExtend()`', () => {
	it('returns subclass', () => {
		class Class {}
		const extension = new Extension(InClass => class extends InClass {});
		const SubClass = classExtend(Class, extension);

		expect(Object.getPrototypeOf(SubClass)).toBe(Class);

		const instance = new SubClass();
		expect(instance).toBeInstanceOf(SubClass);
		expect(instance).toBeInstanceOf(Class);
	});

	it('can be used multiple times to apply multiple extensions', () => {
		class Class {}
		const extension1 = new Extension(InClass => class extends InClass {});
		const extension2 = new Extension(InClass => class extends InClass {});
		const SubClass = classExtend(Class, extension1);
		const SubSubClass = classExtend(SubClass, extension2);

		expect(Object.getPrototypeOf(SubSubClass)).toBe(SubClass);

		const instance = new SubSubClass();
		expect(instance).toBeInstanceOf(SubSubClass);
		expect(instance).toBeInstanceOf(SubClass);
		expect(instance).toBeInstanceOf(Class);
	});

	describe('validates input', () => {
		it('throws if not passed a class', () => {
			const extension = new Extension(InClass => class extends InClass {});
			expect(() => {
				classExtend('123', extension);
			}).toThrowWithMessage(TypeError, 'Class is not a function');
		});

		it('throws if not passed an object as extension', () => {
			expect(() => {
				classExtend(class Class {}, '123');
			}).toThrowWithMessage(TypeError, 'extension must be an object');
		});

		it('throws if extension has name but no version', () => {
			expect(() => {
				classExtend(class Class {}, {name: 'foo', extend() {}});
			}).toThrowWithMessage(TypeError, 'extension.version must be a valid semver version string');
		});

		it('throws if extension has no extend function', () => {
			expect(() => {
				classExtend(class Class {}, {name: 'foo', version: '1.0.0'});
			}).toThrowWithMessage(TypeError, 'extension.extend must be a function');
		});
	});

	describe('validates extension return value', () => {
		it('accepts extension returning input class', () => {
			class Class {}
			const extension = new Extension(InClass => InClass);
			const OutClass = classExtend(Class, extension);
			expect(OutClass).toBe(Class);
		});

		it('throws if extension extend function returns null', () => {
			const extension = new Extension(() => null);
			expect(() => {
				classExtend(class Class {}, extension);
			}).toThrowWithMessage(TypeError, 'Extension did not return a subclass of original class');
		});

		it('throws if extension extend function returns unrelated class', () => {
			const extension = new Extension(() => class AnotherClass {});
			expect(() => {
				classExtend(class Class {}, extension);
			}).toThrowWithMessage(TypeError, 'Extension did not return a subclass of original class');
		});
	});

	describe('deduplicates extensions', () => {
		describe('does not apply same extension twice', () => {
			it('unnamed extension', () => {
				const extension = new Extension(InClass => class extends InClass {});
				const SubClass = classExtend(class Class {}, extension);
				const SubSubClass = classExtend(SubClass, extension);
				expect(SubSubClass).toBe(SubClass);
			});

			it('named extension', () => {
				const extension = new Extension('foo', '1.0.0', InClass => class extends InClass {});
				const SubClass = classExtend(class Class {}, extension);
				const SubSubClass = classExtend(SubClass, extension);
				expect(SubSubClass).toBe(SubClass);
			});
		});

		it('throws if extend with different versions of same extension', () => {
			const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
				extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
			const SubClass = classExtend(class Class {}, extension1);
			expect(() => {
				classExtend(SubClass, extension2);
			}).toThrowWithMessage(
				Error, 'Class is already extended with a different version of this extension'
			);
		});
	});

	describe('deduplicates subclasses', () => {
		it('returns same subclass if extension used twice', () => {
			class Class {}
			const extension = new Extension(InClass => class extends InClass {});
			const SubClass1 = classExtend(Class, extension);
			const SubClass2 = classExtend(Class, extension);
			expect(SubClass2).toBe(SubClass1);
		});

		it('returns different subclasses if different versions of same extension used twice', () => {
			class Class {}
			const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
				extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
			const SubClass1 = classExtend(Class, extension1);
			const SubClass2 = classExtend(Class, extension2);
			expect(SubClass2).not.toBe(SubClass1);
		});
	});
});
