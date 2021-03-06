/* --------------------
 * class-extension module
 * Tests for `Extension` class
 * ------------------*/

/* eslint-disable no-new */

'use strict';

// Modules
const {Extension} = require('class-extension');

// Tests

describe('Extension class', () => {
	describe('with args (name, version, extend)', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension('foo', '1.0.0', extend);
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args (name, version, extends, extend)', () => {
		let extension, depExtension, extend;
		beforeEach(() => {
			extend = () => {};
			depExtension = new Extension(() => {});
			extension = new Extension('foo', '1.0.0', [depExtension], extend);
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records extends array', () => {
			expect(extension.extends).toBeArrayOfSize(1);
			expect(extension.extends).toContain(depExtension);
		});
	});

	describe('with args (extend)', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension(extend);
		});

		it('records name as null', () => {
			expect(extension.name).toBeNull();
		});

		it('records version as null', () => {
			expect(extension.version).toBeNull();
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args (extends, extend)', () => {
		let extension, depExtension, extend;
		beforeEach(() => {
			extend = () => {};
			depExtension = new Extension(() => {});
			extension = new Extension([depExtension], extend);
		});

		it('records name as null', () => {
			expect(extension.name).toBeNull();
		});

		it('records version as null', () => {
			expect(extension.version).toBeNull();
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records extends array', () => {
			expect(extension.extends).toBeArrayOfSize(1);
			expect(extension.extends).toContain(depExtension);
		});
	});

	describe('with args (name, version, {extend})', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension('foo', '1.0.0', {extend});
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args (name, {version, extend})', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension('foo', {version: '1.0.0', extend});
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args (name, {version}, extend)', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension('foo', {version: '1.0.0'}, extend);
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args (name, extend, {version})', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension('foo', extend, {version: '1.0.0'});
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args ({name, version, extend})', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension({name: 'foo', version: '1.0.0', extend});
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args ({name, version, extends, extend})', () => {
		let extension, depExtension, extend;
		beforeEach(() => {
			extend = () => {};
			depExtension = new Extension(() => {});
			extension = new Extension({name: 'foo', version: '1.0.0', extends: [depExtension], extend});
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records extends array', () => {
			expect(extension.extends).toBeArrayOfSize(1);
			expect(extension.extends).toContain(depExtension);
		});
	});

	describe('with args ({name, version}, extend)', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension({name: 'foo', version: '1.0.0'}, extend);
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args (extend, {name, version})', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension(extend, {name: 'foo', version: '1.0.0'});
		});

		it('records name', () => {
			expect(extension.name).toBe('foo');
		});

		it('records version', () => {
			expect(extension.version).toBe('1.0.0');
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args ({extend})', () => {
		let extension, extend;
		beforeEach(() => {
			extend = () => {};
			extension = new Extension({extend});
		});

		it('records name as null', () => {
			expect(extension.name).toBeNull();
		});

		it('records version as null', () => {
			expect(extension.version).toBeNull();
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records empty extends array', () => {
			expect(extension.extends).toBeArrayOfSize(0);
		});
	});

	describe('with args ({extends, extend})', () => {
		let extension, depExtension, extend;
		beforeEach(() => {
			extend = () => {};
			depExtension = new Extension(() => {});
			extension = new Extension({extends: [depExtension], extend});
		});

		it('records name as null', () => {
			expect(extension.name).toBeNull();
		});

		it('records version as null', () => {
			expect(extension.version).toBeNull();
		});

		it('records extend function', () => {
			expect(extension.extend).toBe(extend);
		});

		it('records extends array', () => {
			expect(extension.extends).toBeArrayOfSize(1);
			expect(extension.extends).toContain(depExtension);
		});
	});

	describe('throws error if', () => {
		it('name is empty string', () => {
			expect(() => {
				new Extension('', () => {});
			}).toThrowWithMessage(TypeError, 'name must be a non-empty string');
		});

		describe('version is invalid', () => {
			it('empty string', () => {
				expect(() => {
					new Extension('foo', '', () => {});
				}).toThrowWithMessage(TypeError, 'version must be a valid semver version string');
			});

			it('number', () => {
				expect(() => {
					new Extension('foo', 1, () => {});
				}).toThrowWithMessage(TypeError, 'Unrecognised argument: 1');
			});

			it('incomplete semver string', () => {
				expect(() => {
					new Extension('foo', '1.0', () => {});
				}).toThrowWithMessage(TypeError, 'version must be a valid semver version string');
			});
		});

		describe('name provided but version not provided', () => {
			it('with args (name, extend)', () => {
				expect(() => {
					new Extension('foo', () => {});
				}).toThrowWithMessage(TypeError, 'version must be a valid semver version string');
			});

			it('with args ({name}, extend)', () => {
				expect(() => {
					new Extension({name: 'foo'}, () => {});
				}).toThrowWithMessage(TypeError, 'version must be a valid semver version string');
			});

			it('with args (extend, {name})', () => {
				expect(() => {
					new Extension(() => {}, {name: 'foo'});
				}).toThrowWithMessage(TypeError, 'version must be a valid semver version string');
			});

			it('with args ({name, extend})', () => {
				expect(() => {
					new Extension({name: 'foo', extend() {}});
				}).toThrowWithMessage(TypeError, 'version must be a valid semver version string');
			});
		});

		describe('extend function not provided', () => {
			it('with args ()', () => {
				expect(() => {
					new Extension();
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});

			it('with args (name, version)', () => {
				expect(() => {
					new Extension('foo', '1.0.0');
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});

			it('with args (name, version, {})', () => {
				expect(() => {
					new Extension('foo', '1.0.0', {});
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});

			it('with args (name, {version})', () => {
				expect(() => {
					new Extension('foo', {version: '1.0.0'});
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});

			it('with args ({name, version})', () => {
				expect(() => {
					new Extension({name: 'foo', version: '1.0.0'});
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});
		});

		describe('extend not a function', () => {
			it('with args (true)', () => {
				expect(() => {
					new Extension(true);
				}).toThrowWithMessage(TypeError, 'Unrecognised argument: true');
			});

			it('with args (name, version, true)', () => {
				expect(() => {
					new Extension('foo', '1.0.0', true);
				}).toThrowWithMessage(TypeError, 'Unrecognised argument: true');
			});

			it('with args (name, version, {extend: true})', () => {
				expect(() => {
					new Extension('foo', '1.0.0', {extend: true});
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});

			it('with args (name, {version, extend: true})', () => {
				expect(() => {
					new Extension('foo', {version: '1.0.0', extend: true});
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});

			it('with args ({name, version, extend: true})', () => {
				expect(() => {
					new Extension({name: 'foo', version: '1.0.0', extend: true});
				}).toThrowWithMessage(TypeError, 'extend must be a function');
			});
		});

		describe('extends not an array', () => {
			it('with args ({extends: true}, extend)', () => {
				expect(() => {
					new Extension({extends: true}, () => {});
				}).toThrowWithMessage(TypeError, 'extends must be an array');
			});

			it('with args (name, version, {extends: true}, extend)', () => {
				expect(() => {
					new Extension('foo', '1.0.0', {extends: true}, () => {});
				}).toThrowWithMessage(TypeError, 'extends must be an array');
			});

			it('with args (name, {version, extends: true}, extend)', () => {
				expect(() => {
					new Extension('foo', {version: '1.0.0', extends: true}, () => {});
				}).toThrowWithMessage(TypeError, 'extends must be an array');
			});

			it('with args ({name, version, extends: true, extend})', () => {
				expect(() => {
					new Extension({name: 'foo', version: '1.0.0', extends: true, extend() {}});
				}).toThrowWithMessage(TypeError, 'extends must be an array');
			});
		});

		describe('extends contains invalid extensions', () => {
			it('with args ({extends: [true]}, extend)', () => {
				expect(() => {
					new Extension({extends: [true]}, () => {});
				}).toThrowWithMessage(TypeError, 'extends[0] must be an object');
			});

			it('with args (name, version, {extends: [true]}, extend)', () => {
				expect(() => {
					new Extension('foo', '1.0.0', {extends: [true]}, () => {});
				}).toThrowWithMessage(TypeError, 'extends[0] must be an object');
			});

			it('with args (name, {version, extends: [true]}, extend)', () => {
				expect(() => {
					new Extension('foo', {version: '1.0.0', extends: [true]}, () => {});
				}).toThrowWithMessage(TypeError, 'extends[0] must be an object');
			});

			it('with args ({name, version, extends: [true], extend})', () => {
				expect(() => {
					new Extension({name: 'foo', version: '1.0.0', extends: [true], extend() {}});
				}).toThrowWithMessage(TypeError, 'extends[0] must be an object');
			});
		});
	});
});
