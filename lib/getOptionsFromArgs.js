/* --------------------
 * class-extension module
 * Function to conform args to `Extension` constructor
 * ------------------*/

'use strict';

// Modules
const {isObject, isFunction, isArray, isString} = require('is-it-type');

// Exports

/**
 * Combine arguments into single options object.
 * @param {Array<string|function|array|object>} args - Array of arguments
 * @return {object} - Options object
 */
module.exports = function getOptionsFromArgs(args) {
	const options = {
		name: null,
		version: null,
		extends: [],
		extend: null,
		dependencies: {}
	};
	const explicit = {};

	let arg = args.shift();
	if (isString(arg)) {
		options.name = arg;
		explicit.name = true;
		arg = args.shift();

		if (isString(arg)) {
			options.version = arg;
			explicit.version = true;
			arg = args.shift();
		}
	}

	while (arg) {
		if (isArray(arg)) {
			options.extends = arg;
			explicit.extends = true;
		} else if (isFunction(arg)) {
			options.extend = arg;
			explicit.extend = true;
		} else if (isObject(arg)) {
			for (const key of Object.keys(arg)) {
				const value = arg[key];
				if (value != null && !explicit[key]) options[key] = value;
			}
		} else {
			throw new TypeError(`Unrecognised argument: ${arg}`);
		}
		arg = args.shift();
	}

	return options;
};
