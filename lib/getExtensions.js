/* --------------------
 * class-extension module
 * getExtensions methods
 * ------------------*/

'use strict';

// Imports
const {EXTENSIONS} = require('./symbols.js');

// Exports

module.exports = {
	getExtensions,
	getExtensionsProto
};

/**
 * Get array of extensions this class has been extended with.
 * Intended to be added as a class static method.
 * @returns {Array<Object>} - Array of extensions
 */
function getExtensions() {
	// eslint-disable-next-line no-invalid-this
	return classGetExtensions(this);
}

/**
 * Get list of extensions an instance of a class has been extended with.
 * Intended to be added as a class prototype method.
 * @returns {Array<Object>} - Array of extensions
 */
function getExtensionsProto() {
	// eslint-disable-next-line no-invalid-this
	return classGetExtensions(this.constructor);
}

/**
 * Get array of extensions a class has been extended with.
 * @param {function} Class - Class
 * @returns {Array<Object>} - Array of extensions
 */
function classGetExtensions(Class) {
	// Return array of extensions
	const extensions = Class[EXTENSIONS];
	if (!extensions) return [];
	return Array.from(extensions);
}
