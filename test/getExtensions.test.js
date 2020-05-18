/* --------------------
 * class-extension module
 * Tests for `getExtensions` methods
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

describe('`.getExtensions()` static method', () => {
	describe('returns array of extensions', () => {
		describe('when no extensions and', () => {
			it('it is not subclassed', () => {
				expect(Class.getExtensions()).toBeArrayOfSize(0);
			});

			it('it is subclassed', () => {
				class SubClass extends Class {}
				expect(SubClass.getExtensions()).toBeArrayOfSize(0);
			});
		});

		describe('when one extension and', () => {
			it('it is not subclassed', () => {
				const extension = new Extension(InClass => class extends InClass {});
				const SubClass = Class.extend(extension);
				const extensions = SubClass.getExtensions();
				expect(extensions).toBeArrayOfSize(1);
				expect(extensions).toIncludeSameMembers([extension]);
			});

			it('it is subclassed', () => {
				const extension = new Extension(InClass => class extends InClass {});
				const SubClass = Class.extend(extension);
				class SubSubClass extends SubClass {}
				const extensions = SubSubClass.getExtensions();
				expect(extensions).toBeArrayOfSize(1);
				expect(extensions).toIncludeSameMembers([extension]);
			});
		});

		describe('when two extensions and', () => {
			describe('it is not subclassed', () => {
				let extension1, extension2, extensions;
				beforeEach(() => {
					extension1 = new Extension(InClass => class extends InClass {});
					extension2 = new Extension(InClass => class extends InClass {});
					const SubClass = Class.extend(extension1).extend(extension2);
					extensions = SubClass.getExtensions();
				});

				it('array includes both extensions', () => {
					expect(extensions).toBeArrayOfSize(2);
					expect(extensions).toIncludeSameMembers([extension1, extension2]);
				});

				it('array lists extensions in order of application', () => {
					expect(extensions).toBeArrayOfSize(2);
					expect(extensions[0]).toBe(extension1);
					expect(extensions[1]).toBe(extension2);
				});
			});

			describe('it is subclassed', () => {
				let extension1, extension2, extensions;
				beforeEach(() => {
					extension1 = new Extension(InClass => class extends InClass {});
					extension2 = new Extension(InClass => class extends InClass {});
					const SubClass = Class.extend(extension1).extend(extension2);
					class SubSubClass extends SubClass {}
					extensions = SubSubClass.getExtensions();
				});

				it('array includes both extensions', () => {
					expect(extensions).toBeArrayOfSize(2);
					expect(extensions).toIncludeSameMembers([extension1, extension2]);
				});

				it('array lists extensions in order of application', () => {
					expect(extensions).toBeArrayOfSize(2);
					expect(extensions[0]).toBe(extension1);
					expect(extensions[1]).toBe(extension2);
				});
			});
		});
	});
});
