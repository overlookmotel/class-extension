/* --------------------
 * class-extension module
 * `addMethodsToClass` function
 * ------------------*/

'use strict';

// Imports
const Extension = require('./extension.js'),
	{extend} = require('./extend.js'),
	{isExtendedWith, isExtendedWithProto} = require('./isExtendedWith.js'),
	{getExtensions, getExtensionsProto} = require('./getExtensions.js'),
	{isDirectlyExtended, isDirectlyExtendedProto} = require('./isDirectlyExtended.js'),
	{validateClass} = require('./validate.js');

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
	Class.getExtensions = getExtensions;
	Class.prototype.getExtensions = getExtensionsProto;
	Class.isDirectlyExtended = isDirectlyExtended;
	Class.prototype.isDirectlyExtended = isDirectlyExtendedProto;

	// Return class
	return Class;
};
