/* --------------------
 * class-extension module
 * Tests for `extend` method
 * ------------------*/

/* eslint-disable class-methods-use-this */

'use strict';

// Modules
const {addMethodsToClass, Extension} = require('class-extension');

// Init
const spy = jest.fn;

// Tests

let Class;
beforeEach(() => {
	Class = class {};
	addMethodsToClass(Class);
});

describe('`.extend()`', () => {
	it('calls extension.extend() with Class and extension', () => {
		const extend = spy(InClass => class extends InClass {});
		const extension = new Extension(extend);
		Class.extend(extension);
		expect(extend).toHaveBeenCalledTimes(1);
		expect(extend).toHaveBeenCalledWith(Class, extension);
	});

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
		expect(SubSubClass).toBeSubclassOf(Class);

		const instance = new SubSubClass();
		expect(instance).toBeInstanceOf(SubSubClass);
		expect(instance).toBeInstanceOf(SubClass);
		expect(instance).toBeInstanceOf(Class);
	});

	it('can be used multiple times to apply multiple extensions', () => {
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

	describe('validates input', () => {
		it('throws if not passed an object as extension', () => {
			expect(() => {
				Class.extend('123');
			}).toThrowWithMessage(TypeError, 'extension must be an object');
		});

		it('throws if extension has name but no version', () => {
			expect(() => {
				Class.extend({name: 'foo', extend() {}});
			}).toThrowWithMessage(TypeError, 'extension.version must be a valid semver version string');
		});

		it('throws if extension has no extend function', () => {
			expect(() => {
				Class.extend({name: 'foo', version: '1.0.0'});
			}).toThrowWithMessage(TypeError, 'extension.extend must be a function');
		});

		it('throws if extension has no extends array', () => {
			expect(() => {
				Class.extend({name: 'foo', version: '1.0.0', extend() {}});
			}).toThrowWithMessage(TypeError, 'extension.extends must be an array');
		});
	});

	describe('validates extension return value', () => {
		it('accepts extension returning input class', () => {
			const extension = new Extension(InClass => InClass);
			const OutClass = Class.extend(extension);
			expect(OutClass).toBe(Class);
		});

		it('throws if extension extend function returns null', () => {
			const extension = new Extension(() => null);
			expect(() => {
				Class.extend(extension);
			}).toThrowWithMessage(TypeError, 'Extension did not return a subclass of original class');
		});

		it('throws if extension returns sub sub class', () => {
			const extension = new Extension((InClass) => {
				const Class2 = class extends InClass {};
				return class extends Class2 {};
			});
			expect(() => {
				Class.extend(extension);
			}).toThrowWithMessage(TypeError, 'Extension did not return a subclass of original class');
		});

		it('throws if extension extend function returns unrelated class', () => {
			const extension = new Extension(() => class AnotherClass {});
			expect(() => {
				Class.extend(extension);
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

			const SubClass = Class.extend(extension2);

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

			const SubClass = Class.extend(extension3);

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

			const SubClass = Class.extend(extension3);

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
				const SubClass = Class.extend(extension);
				const SubSubClass = SubClass.extend(extension);
				expect(SubSubClass).toBe(SubClass);
			});

			it('named extension', () => {
				const extension = new Extension('foo', '1.0.0', InClass => class extends InClass {});
				const SubClass = Class.extend(extension);
				const SubSubClass = SubClass.extend(extension);
				expect(SubSubClass).toBe(SubClass);
			});

			it('named extension with same version', () => {
				const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
					extension2 = new Extension('foo', '1.0.0', InClass => class extends InClass {});
				const SubClass = Class.extend(extension1);
				const SubSubClass = SubClass.extend(extension2);
				expect(SubSubClass).toBe(SubClass);
			});

			describe('named extension with version within version range', () => {
				it('specified via option to `.extend()`', () => {
					const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
						extension2 = new Extension('foo', '1.1.0', InClass => class extends InClass {});
					const SubClass = Class.extend(extension1);
					const SubSubClass = SubClass.extend(extension2, {version: '^1.0.0'});
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

					const SubClass = Class.extend(extension1);
					const SubSubClass = SubClass.extend(extension3);
					const instance = new SubSubClass();
					expect(instance.getVersion()).toBe('1.0.0');
				});
			});

			describe('with diamond dependency graph', () => {
				it('created by 2 calls to extend()', () => {
					const extension1 = new Extension(InClass => class extends InClass {
						constructor() {
							super();
							this.count = (this.count || 0) + 1;
						}
					});
					const extension2 = new Extension([extension1], InClass => class extends InClass {});
					const extension3 = new Extension([extension1], InClass => class extends InClass {});
					const SubClass = Class.extend(extension2)
						.extend(extension3);
					const instance = new SubClass();
					expect(instance.count).toBe(1);
				});

				it('created within extension', () => {
					const extension1 = new Extension(InClass => class extends InClass {
						constructor() {
							super();
							this.count = (this.count || 0) + 1;
						}
					});
					const extension2 = new Extension([extension1], InClass => class extends InClass {});
					const extension3 = new Extension([extension1], InClass => class extends InClass {});
					const extension4 = new Extension(
						[extension2, extension3],
						InClass => class extends InClass {}
					);
					const SubClass = Class.extend(extension4);
					const instance = new SubClass();
					expect(instance.count).toBe(1);
				});
			});
		});

		describe('throws if extend with different version of same extension', () => {
			it('and no version range provided', () => {
				const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
					extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
				const SubClass = Class.extend(extension1);
				expect(() => {
					SubClass.extend(extension2);
				}).toThrow(new Error(
					"Class is already extended with version 1.0.0 of extension 'foo', which differs from version 2.0.0 now being applied"
				));
			});

			describe('and outside version range', () => {
				it('specified via option to `.extend()`', () => {
					const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
						extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
					const SubClass = Class.extend(extension1);
					expect(() => {
						SubClass.extend(extension2, {version: '^2.0.0'});
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

					const SubClass = Class.extend(extension1);
					expect(() => {
						SubClass.extend(extension3);
					}).toThrow(new Error(
						"Class is already extended with version 1.0.0 of extension 'foo', which does not satisfy specified version range '^2.0.0'"
					));
				});
			});
		});
	});

	describe('deduplicates subclasses', () => {
		it('returns same subclass if extension used twice', () => {
			const extension = new Extension(InClass => class extends InClass {});
			const SubClass1 = Class.extend(extension);
			const SubClass2 = Class.extend(extension);
			expect(SubClass2).toBe(SubClass1);
		});

		it('returns different subclasses if different versions of same extension used twice', () => {
			const extension1 = new Extension('foo', '1.0.0', InClass => class extends InClass {}),
				extension2 = new Extension('foo', '2.0.0', InClass => class extends InClass {});
			const SubClass1 = Class.extend(extension1);
			const SubClass2 = Class.extend(extension2);
			expect(SubClass2).not.toBe(SubClass1);
		});
	});
});
