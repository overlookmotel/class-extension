/* --------------------
 * class-extension module
 * isExtendedWith methods
 * ------------------*/

'use strict';

// Modules
const hasOwnProperty = require('has-own-prop');

// Imports
const {validateExtension} = require('./validate.js'),
	{EXTENSIONS, NAMED_EXTENSIONS} = require('./symbols.js');

// Exports

module.exports = {
	isExtendedWith,
	isExtendedWithProto
};

/**
 * Check if a class has been extended with specified extension.
 * Intended to be added as a class static method.
 * @param {Object} extension - Extension object
 * @returns {boolean} - `true` if extension used
 */
function isExtendedWith(extension) {
	// eslint-disable-next-line no-invalid-this
	return classIsExtendedWith(this, extension);
}

/**
 * Check if object is instance of a class which has been extended with specified extension.
 * Intended to be added as a class prototype method.
 * @param {Object} extension - Extension object
 * @returns {boolean} - `true` if extension used
 */
function isExtendedWithProto(extension) {
	// eslint-disable-next-line no-invalid-this
	return classIsExtendedWith(this.constructor, extension);
}

/**
 * Check if a class has been extended with specified extension.
 * @param {function} Class - Class
 * @param {Object} extension - Extension object
 * @returns {boolean} - `true` if extension used
 */
function classIsExtendedWith(Class, extension) {
	// Validate input
	validateExtension(extension);

	// Determine if class was extended with this extension
	if (!hasOwnProperty(Class, EXTENSIONS)) return false;

	if (Class[EXTENSIONS].has(extension)) return true;

	const {name} = extension;
	if (!name) return false;

	const namedExtensions = Class[NAMED_EXTENSIONS];
	return !!(namedExtensions && namedExtensions[name]);
}
