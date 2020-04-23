/* --------------------
 * class-extension module
 * extend methods
 * ------------------*/

'use strict';

// Modules
const hasOwnProperty = require('has-own-prop');

// Imports
const {validateClass, validateExtension} = require('./shared.js'),
	{CACHE, EXTENSIONS, NAMED_EXTENSIONS} = require('./symbols.js');

// Exports

module.exports = {
	extend,
	classExtend
};

/**
 * Extend method.
 * Intended to be added as a class static method.
 * @param {Object} extension - Extension object
 * @returns {function} - Subclass with extension applied
 */
function extend(extension) {
	// eslint-disable-next-line no-invalid-this
	return classExtend(this, extension);
}

/**
 * Extend class.
 * Uses a cache stored to ensure if called with the same extension again,
 * the same subclass is returned, rather than creating another identical subclass.
 * @param {function} Class - Class to be extended
 * @param {Object} extension - Extension object
 * @returns {function} - Subclass with extension applied
 */
function classExtend(Class, extension) {
	// Validate input
	validateClass(Class);
	validateExtension(extension);

	// If already extended with this extension, do not extend again
	const extensions = Class[EXTENSIONS];
	let namedExtensions;

	const {name} = extension;
	if (extensions) {
		if (extensions.has(extension)) return Class;

		if (name) {
			namedExtensions = Class[NAMED_EXTENSIONS];
			const existingExtension = namedExtensions[name];
			if (existingExtension) {
				if (existingExtension.version !== extension.version) {
					throw new Error(
						'Class is already extended with a different version of this extension'
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

	// Not in cache, extend
	const SubClass = extension.extend(Class);
	if (!SubClass || (SubClass !== Class && Object.getPrototypeOf(SubClass) !== Class)) {
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
}
