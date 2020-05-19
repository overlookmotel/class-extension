/* --------------------
 * class-extension module
 * Entry point
 * ------------------*/

'use strict';

// Imports
const Extension = require('./extension.js'),
	extend = require('./extend.js'),
	isExtendedWithMethods = require('./isExtendedWith.js'),
	getExtensionsMethods = require('./getExtensions.js'),
	isDirectlyExtendedMethods = require('./isDirectlyExtended.js'),
	addMethodsToClass = require('./addMethods.js'),
	getOptionsFromArgs = require('./getOptionsFromArgs.js');

// Exports

module.exports = {
	Extension,
	extend,
	...isExtendedWithMethods,
	...getExtensionsMethods,
	...isDirectlyExtendedMethods,
	addMethodsToClass,
	getOptionsFromArgs
};
