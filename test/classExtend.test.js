/* --------------------
 * class-extension module
 * Tests for `classExtend` function
 * ------------------*/

/* eslint-disable class-methods-use-this */

'use strict';

// Modules
const {classExtend, Extension} = require('class-extension');

// Tests

describe('`.classExtend()`', () => {
	it('returns subclass', () => {
		class Class {}
		const extension = new Extension(InClass => class extends InClass {});
		const SubClass = classExtend(Class, extension);

		expect(SubClass).toBeDirectSubclassOf(Class);

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

		expect(SubSubClass).toBeDirectSubclassOf(SubClass);

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

		it('throws if extension has no extends array', () => {
			expect(() => {
				classExtend(class Class {}, {name: 'foo', version: '1.0.0', extend() {}});
			}).toThrowWithMessage(TypeError, 'extension.extends must be an array');
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

		it('throws if extension returns sub sub class', () => {
			const extension = new Extension((InClass) => {
				const Class2 = class extends InClass {};
				return class extends Class2 {};
			});
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

	describe('adds dependent extensions', () => {
		it('with one dependency', () => {
			const extension1 = new Extension(InClass => class ExtClass1 extends InClass {ext1() {}});
			const extension2 = new Extension(
				[extension1],
				InClass => class ExtClass2 extends InClass {ext2() {}}
			);

			class Class {}
			const SubClass = classExtend(Class, extension2);

			expect(SubClass).toBeSubclassOf(Class);
			expect(SubClass).not.toBeDirectSubclassOf(Class);
			const instance = new SubClass();
			expect(instance.ext1).toBeFunction();
			expect(instance.ext2).toBeFunction();
		});

		it('with two dependencies', () => {
			const extension1 = new Extension(InClass => class ExtClass1 extends InClass {ext1() {}});
			const extension2 = new Extension(InClass => class ExtClass2 extends InClass {ext2() {}});
			const extension3 = new Extension(
				[extension1, extension2],
				InClass => class ExtClass3 extends InClass {ext3() {}}
			);

			class Class {}
			const SubClass = classExtend(Class, extension3);

			expect(SubClass).toBeSubclassOf(Class);
			expect(SubClass).not.toBeDirectSubclassOf(Class);
			const instance = new SubClass();
			expect(instance.ext1).toBeFunction();
			expect(instance.ext2).toBeFunction();
			expect(instance.ext3).toBeFunction();
		});

		it('with nested dependencies', () => {
			const extension1 = new Extension(InClass => class ExtClass1 extends InClass {ext1() {}});
			const extension2 = new Extension(
				[extension1],
				InClass => class ExtClass2 extends InClass {ext2() {}}
			);
			const extension3 = new Extension(
				[extension2],
				InClass => class ExtClass3 extends InClass {ext3() {}}
			);

			class Class {}
			const SubClass = classExtend(Class, extension3);

			expect(SubClass).toBeSubclassOf(Class);
			expect(SubClass).not.toBeDirectSubclassOf(Class);
			const instance = new SubClass();
			expect(instance.ext1).toBeFunction();
			expect(instance.ext2).toBeFunction();
			expect(instance.ext3).toBeFunction();
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

			it('named extension with same version', () => {
				const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
					extension2 = new Extension('foo', '1.0.0', InClass => class extends InClass {});
				const SubClass = classExtend(class Class {}, extension1);
				const SubSubClass = classExtend(SubClass, extension2);
				expect(SubSubClass).toBe(SubClass);
			});

			describe('named extension with version within version range', () => {
				it('specified via option to `.extend()`', () => {
					const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
						extension2 = new Extension('foo', '1.1.0', InClass => class extends InClass {});
					const SubClass = classExtend(class Class {}, extension1);
					const SubSubClass = classExtend(SubClass, extension2, {version: '^1.0.0'});
					expect(SubSubClass).toBe(SubClass);
				});

				it('specified in extension dependencies', () => {
					const extension1 = new Extension(
						'foo', '1.0.0', InClass => class extends InClass {getVersion() { return '1.0.0'; }}
					);
					const extension2 = new Extension(
						'foo', '1.1.0', InClass => class extends InClass {getVersion() { return '1.1.0'; }}
					);
					const extension3 = new Extension(
						'bar', '0.0.0',
						{dependencies: {foo: '^1.0.0'}},
						[extension2],
						InClass => class extends InClass {}
					);

					const SubClass = classExtend(class Class {}, extension1);
					const SubSubClass = classExtend(SubClass, extension3);
					const instance = new SubSubClass();
					expect(instance.getVersion()).toBe('1.0.0');
				});
			});
		});

		describe('throws if extend with different version of same extension', () => {
			it('and no version range provided', () => {
				const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
					extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
				const SubClass = classExtend(class Class {}, extension1);
				expect(() => {
					classExtend(SubClass, extension2);
				}).toThrow(new Error(
					"Class is already extended with version 1.0.0 of extension 'foo', which differs from version 2.0.0 now being applied"
				));
			});

			describe('and outside version range', () => {
				it('specified via option to `.extend()`', () => {
					const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
						extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
					const SubClass = classExtend(class Class {}, extension1);
					expect(() => {
						classExtend(SubClass, extension2, {version: '^2.0.0'});
					}).toThrow(new Error(
						"Class is already extended with version 1.0.0 of extension 'foo', which does not satisfy specified version range '^2.0.0'"
					));
				});

				it('specified in extension dependencies', () => {
					const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
						extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
					const extension3 = new Extension(
						'bar', '0.0.0',
						{dependencies: {foo: '^2.0.0'}},
						[extension2],
						InClass => class extends InClass {}
					);

					const SubClass = classExtend(class Class {}, extension1);
					expect(() => {
						classExtend(SubClass, extension3);
					}).toThrow(new Error(
						"Class is already extended with version 1.0.0 of extension 'foo', which does not satisfy specified version range '^2.0.0'"
					));
				});
			});
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
