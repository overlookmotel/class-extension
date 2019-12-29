/* --------------------
 * class-extension module
 * Entry point
 * ------------------*/

'use strict';

// Imports
const Extension = require('./extension'),
	extendMethods = require('./extend'),
	isExtendedWithMethods = require('./isExtendedWith'),
	addMethodsToClass = require('./addMethods');

// Exports
module.exports = {
	Extension,
	...extendMethods,
	...isExtendedWithMethods,
	addMethodsToClass
};
