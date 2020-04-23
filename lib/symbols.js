/* --------------------
 * class-extension module
 * Symbols
 * ------------------*/

'use strict';

// Modules
const makeSymbols = require('symbols-collection');

// Imports
const packageName = require('../package.json').name;

// Exports

module.exports = makeSymbols(packageName, [
	'CACHE',
	'EXTENSIONS',
	'NAMED_EXTENSIONS'
]);
