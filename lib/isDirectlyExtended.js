/* --------------------
 * class-extension module
 * isDirectlyExtended methods
 * ------------------*/

'use strict';

// Modules
const hasOwnProperty = require('has-own-prop');

// Imports
const {validateClass, validateInstance} = require('./validate.js'),
	{EXTENSIONS} = require('./symbols.js');

// Exports

module.exports = {
	isDirectlyExtended,
	isDirectlyExtendedProto,
	classIsDirectlyExtended,
	instanceisDirectlyExtended
};

/**
 * Check if a class has been extended directly (with any extension).
 * Intended to be added as a class static method.
 * @returns {boolean} - `true` if extension directly
 */
function isDirectlyExtended() {
	// eslint-disable-next-line no-invalid-this
	return classIsDirectlyExtended(this);
}

/**
 * Check if object is instance of a class which has been extended directly (with any extension).
 * Intended to be added as a class prototype method.
 * @returns {boolean} - `true` if extension directly
 */
function isDirectlyExtendedProto() {
	// eslint-disable-next-line no-invalid-this
	return instanceisDirectlyExtended(this);
}

/**
 * Check if object is instance of a class which has been extended directly (with any extension).
 * @param {Object} instance - Class instance
 * @returns {boolean} - `true` if extension directly
 */
function instanceisDirectlyExtended(instance) {
	validateInstance(instance);
	return classIsDirectlyExtended(instance.constructor);
}

/**
 * Check if a class has been extended directly (with any extension).
 * @param {function} Class - Class
 * @returns {boolean} - `true` if extension directly
 */
function classIsDirectlyExtended(Class) {
	validateClass(Class);
	return hasOwnProperty(Class, EXTENSIONS);
}
