/* --------------------
 * class-extension module
 * Symbols
 * ------------------*/

'use strict';

// Modules
const makeSymbols = require('symbols-collection');

// Exports
const packageName = require('../package.json').name;

module.exports = makeSymbols(packageName, [
	'CACHE',
	'EXTENSIONS',
	'NAMED_EXTENSIONS'
]);
