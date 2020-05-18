/* --------------------
 * class-extension module
 * Extension class
 * ------------------*/

'use strict';

// Modules
const {isObject, isFunction, isArray, isString} = require('is-it-type');

// Import
const {
	validateName, validateVersion, validateExtend, validateExtensions, validateDependencies
} = require('./validate.js');

// Exports

/**
 * Extension class
 *
 * Constructor can be called with various forms of arguments:
 *   - Args can be passed individually or as properties of an object, or a mix
 *   - `name` can be passed as 1st arg or as property of object, or omitted
 *   - `version` can be passed as 2nd arg or as property of object, or omitted if no name
 *   - `extends` array can be passed as next arg or as property of object
 *   - `extend` function can be passed as next arg or as property of object
 *   - `dependencies` object can be passed only as property of object
 *
 * Parameters passed as arguments take precedence over those passed as object properties.
 * i.e. `(name, {name})`, name used is 1st arg.
 *
 * Valid arguments:
 *   - name, version, extends, extend
 *   - extend
 *   - extends, extend
 *   - name, version, {extend}
 *   - name, {version}, extend
 *   - name, {version, extend}
 *   - extend, {name, version}
 *   - {name, version, extend}
 *   - {name, version}, extend
 *   (`extends` can be added as a prop of object to any of forms above with an object argument)
 *   (`dependencies` can be added as a prop of object to any of forms above with an object argument)
 *
 * This flexibilty allows:
 * 1. Manually calling with `[name], [version], [extensions], extend`
 * 2. Passing `package.json` object as arg to provide `name`, `version` and `dependencies`
 *
 * @param {string} [name] - Extension name
 * @param {string} [version] - Extension version
 * @param {Array} [extends] - Dependent extensions array
 * @param {function} [extend] - Extend function
 * @param {Object} [props] - Properties object or extension name as string
 * @param {string} [props.name] - Extension name
 * @param {string} [props.version] - Extension version
 * @param {Array} [props.extends] - Dependent extensions array
 * @param {function} [props.extend] - Extend function
 * @param {Object} [props.dependencies] - Dependencies object
 */
module.exports = class Extension {
	constructor(...args) {
		// Conform arguments
		let name, version, extend, extensions, dependencies;

		let arg = args.shift();
		if (isString(arg)) {
			name = arg;
			arg = args.shift();

			if (isString(arg)) {
				version = arg;
				arg = args.shift();
			}
		}

		while (arg) {
			if (isArray(arg)) {
				extensions = arg;
			} else if (isFunction(arg)) {
				extend = arg;
			} else if (isObject(arg)) {
				if (name == null) name = arg.name;
				if (version == null) version = arg.version;
				if (!extend) extend = arg.extend;
				if (!extensions) extensions = arg.extends;
				if (arg.dependencies) dependencies = arg.dependencies;
			}
			arg = args.shift();
		}

		// Validate input
		if (name != null) {
			validateName(name);
			validateVersion(version);
		} else {
			name = null;
			version = null;
		}

		validateExtend(extend);

		if (extensions != null) {
			validateExtensions(extensions);
		} else {
			extensions = [];
		}

		if (dependencies != null) {
			validateDependencies(dependencies);
		} else {
			dependencies = {};
		}

		// Save props
		this.name = name;
		this.version = version;
		this.extend = extend;
		this.extends = extensions;
		this.dependencies = dependencies;
	}
};
