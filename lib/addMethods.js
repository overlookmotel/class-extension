/* --------------------
 * class-extension module
 * `addMethodsToClass` function
 * ------------------*/

'use strict';

// Imports
const Extension = require('./extension'),
	{extend} = require('./extend'),
	{isExtendedWith, isExtendedWithProto} = require('./isExtendedWith'),
	{validateClass} = require('./shared');

// Exports

/**
 * Add extension methods to a class
 * @param {function} Class - Class
 * @returns {function} - Input class
 */
module.exports = function addMethodsToClass(Class) {
	// Validate input
	validateClass(Class);

	// Add methods
	Class.Extension = Extension;
	Class.extend = extend;
	Class.isExtendedWith = isExtendedWith;
	Class.prototype.isExtendedWith = isExtendedWithProto;

	// Return class
	return Class;
};
