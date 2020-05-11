/* --------------------
 * class-extension module
 * Entry point
 * ------------------*/

'use strict';

// Imports
const Extension = require('./extension.js'),
	extendMethods = require('./extend.js'),
	isExtendedWithMethods = require('./isExtendedWith.js'),
	getExtensionsMethods = require('./getExtensions.js'),
	addMethodsToClass = require('./addMethods.js');

// Exports

module.exports = {
	Extension,
	...extendMethods,
	...isExtendedWithMethods,
	...getExtensionsMethods,
	addMethodsToClass
};
