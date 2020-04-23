/* --------------------
 * class-extension module
 * Tests for `isExtendedWith` methods
 * ------------------*/

'use strict';

// Modules
const {addMethodsToClass, Extension} = require('class-extension');

// Tests

describe('`.isExtendedWith()` static method', () => {
	describe('returns true if', () => {
		describe('class extended with specified extension and', () => {
			it('no further extensions added', () => {
				const Class = addMethodsToClass(class {});
				const extension = new Extension(InClass => class extends InClass {});
				const SubClass = Class.extend(extension);
				expect(SubClass.isExtendedWith(extension)).toBe(true);
			});

			it('other extension added later', () => {
				const Class = addMethodsToClass(class {});
				const extension1 = new Extension(InClass => class extends InClass {}),
					extension2 = new Extension(InClass => class extends InClass {});
				const SubClass = Class.extend(extension1)
					.extend(extension2);
				expect(SubClass.isExtendedWith(extension1)).toBe(true);
				expect(SubClass.isExtendedWith(extension2)).toBe(true);
			});
		});

		describe('class extended with different version of specified extension and', () => {
			it('no further extensions added', () => {
				const Class = addMethodsToClass(class {});
				const extensionV1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
					extensionV2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
				const SubClass = Class.extend(extensionV1);
				expect(SubClass.isExtendedWith(extensionV2)).toBe(true);
			});

			it('other extension added later', () => {
				const Class = addMethodsToClass(class {});
				const extension1V1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
					extension1V2 = new Extension('foo', '2.0.0', InClass => class extends InClass {}),
					extension2 = new Extension(InClass => class extends InClass {});
				const SubClass = Class.extend(extension1V1)
					.extend(extension2);
				expect(SubClass.isExtendedWith(extension1V2)).toBe(true);
				expect(SubClass.isExtendedWith(extension2)).toBe(true);
			});
		});
	});

	describe('return false if', () => {
		it('class has not been extended', () => {
			const Class = addMethodsToClass(class {});
			const extension = new Extension(InClass => class extends InClass {});
			expect(Class.isExtendedWith(extension)).toBe(false);
		});

		it('class has been extended with some other extension', () => {
			const Class = addMethodsToClass(class {});
			const extension1 = new Extension(InClass => class extends InClass {}),
				extension2 = new Extension(InClass => class extends InClass {});
			const SubClass = Class.extend(extension2);
			expect(SubClass.isExtendedWith(extension1)).toBe(false);
		});
	});
});
