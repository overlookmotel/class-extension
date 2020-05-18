/* --------------------
 * class-extension module
 * extend method
 * ------------------*/

'use strict';

// Modules
const assert = require('assert'),
	semverSatisfies = require('semver').satisfies,
	{isObject, isString} = require('is-it-type'),
	hasOwnProperty = require('has-own-prop');

// Imports
const {validateExtension} = require('./validate.js'),
	{CACHE, EXTENSIONS, NAMED_EXTENSIONS} = require('./symbols.js');

// Exports

/**
 * Extend class.
 * Intended to be added as a class static method.
 * Uses a cache to ensure if called with the same extension again,
 * the same subclass is returned, rather than creating another identical subclass.
 *
 * @param {Object} extension - Extension object
 * @param {Object} [options] - Options object
 * @param {string} [options.version] - Acceptable version range
 * @returns {function} - Subclass with extension applied
 */
module.exports = function extend(extension, options) {
	// Validate input
	validateExtension(extension);

	let versionRange;
	if (options == null) {
		options = {};
	} else {
		if (!isObject(options)) throw new TypeError('options must be an object if provided');
		versionRange = options.version;
		if (versionRange != null && !isString(versionRange)) {
			throw new TypeError('options.version must be a string if provided');
		}
	}

	// Apply dependent extensions
	let Class = this;
	const {dependencies} = extension;
	for (const dependentExtension of extension.extends) {
		let dependentVersion;
		const dependentName = dependentExtension.name;
		if (dependentName) dependentVersion = dependencies[dependentName];

		Class = Class.extend(dependentExtension, {version: dependentVersion});
	}

	// If already extended with this extension, do not extend again
	const extensions = Class[EXTENSIONS];
	let namedExtensions;

	const {name} = extension;
	if (extensions) {
		if (extensions.has(extension)) return Class;

		if (name) {
			namedExtensions = Class[NAMED_EXTENSIONS];
			const existingExtension = namedExtensions && namedExtensions[name];
			if (existingExtension) {
				// Check if existing version satifies version range specified
				// or if no version range specified, that it's exact same version
				const existingVersion = existingExtension.version;
				if (versionRange) {
					assert(
						semverSatisfies(existingVersion, versionRange),
						`Class is already extended with version ${existingVersion} of extension '${name}', which does not satisfy specified version range '${versionRange}'`
					);
				} else {
					assert(
						existingVersion === extension.version,
						`Class is already extended with version ${existingVersion} of extension '${name}', which differs from version ${extension.version} now being applied`
					);
				}

				return Class;
			}
		}
	}

	// Init cache
	let cache;
	if (hasOwnProperty(Class, CACHE)) {
		cache = Class[CACHE];
	} else {
		cache = new Map();
		Class[CACHE] = cache;
	}

	// If in cache, return it
	const Cached = cache.get(extension);
	if (Cached) return Cached;

	// Not in cache - extend
	const SubClass = extension.extend(Class);

	// Check `.extend()` returned input class or a direct subclass of input class
	if (!SubClass || (SubClass !== Class && !isDirectSubclassOf(SubClass, Class))) {
		throw new TypeError('Extension did not return a subclass of original class');
	}

	// Record extension
	const newExtensions = new Set(extensions);
	newExtensions.add(extension);
	SubClass[EXTENSIONS] = newExtensions;

	if (name) SubClass[NAMED_EXTENSIONS] = {...namedExtensions, [name]: extension};

	// Add to cache
	cache.set(extension, SubClass);

	// Return subclass
	return SubClass;
};

const {getPrototypeOf} = Object;
function isDirectSubclassOf(SubClass, Class) {
	return getPrototypeOf(SubClass) === Class
		&& getPrototypeOf(SubClass.prototype) === Class.prototype;
}
