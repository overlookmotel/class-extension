/* --------------------
 * class-extension module
 * Extension class
 * ------------------*/

'use strict';

// Import
const getOptionsFromArgs = require('./getOptionsFromArgs.js'),
	{
		validateName, validateVersion, validateExtend, validateExtensions, validateDependencies
	} = require('./validate.js');

// Exports

/**
 * Extension class.
 *
 * Receives `name`, `version`, `extend`, `extends`, and `dependencies` properties.
 * Only `extend` is mandatory.
 * `version` is mandatory if `name` is provided.
 *
 * Constructor can be called with various forms of arguments:
 *   - Args can be passed individually or as properties of an object, or a series of objects, or a mix
 *   - `name` can be passed as 1st arg or as property of object, or omitted
 *   - `version` can be passed as 2nd arg or as property of object, or omitted if no name
 *   - `extends` array can be passed as any arg or as property of object
 *   - `extend` function can be passed as any arg or as property of object
 *   - `dependencies` object can be passed only as property of object
 *
 * Parameters passed as arguments take precedence over those passed as object properties.
 * i.e. `(name, {name})` -> name used is 1st arg.
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
		// Conform args into single options object
		const options = getOptionsFromArgs(args);

		// Validate input
		const {name} = options;
		if (name != null) {
			validateName(name);
			validateVersion(options.version);
		}

		validateExtend(options.extend);
		validateExtensions(options.extends);
		validateDependencies(options.dependencies);

		// Save options
		for (const key of ['name', 'version', 'extend', 'extends', 'dependencies']) {
			this[key] = options[key];
		}
	}
};
