/* --------------------
 * class-extension module
 * Shared methods
 * ------------------*/

'use strict';

// Modules
const {isObject, isFunction, isArray, isFullString} = require('is-it-type'),
	{valid: validSemver, validRange: validSemverRange} = require('semver');

// Exports

module.exports = {
	validateClass,
	validateExtension,
	validateInstance,
	validateName,
	validateVersion,
	validateExtensions,
	validateExtend,
	validateDependencies
};

function validateClass(Class) {
	if (!isFunction(Class)) throwErr('Class is not a function');
}

function validateExtension(extension, prefix) {
	if (!prefix) prefix = 'extension';

	if (!isObject(extension)) throwErr(`${prefix} must be an object`);

	if (extension.name != null) {
		validateName(extension.name, prefix);
		validateVersion(extension.version, prefix);
	}
	validateExtend(extension.extend, prefix);
	validateExtensions(extension.extends, prefix);
	validateDependencies(extension.dependencies, prefix);
}

function validateExtensions(extensions, prefix) {
	if (!isArray(extensions)) throwErr('extends must be an array', prefix);

	extensions.forEach((extension, index) => {
		validateExtension(extension, addPrefix(prefix, `extends[${index}]`));
	});
}

function validateInstance(instance) {
	if (!instance) throwErr('Not a class instance');
}

function validateName(name, prefix) {
	if (!isFullString(name)) throwErr('name must be a non-empty string', prefix);
}

function validateVersion(version, prefix) {
	if (!isFullString(version) || !validSemver(version)) {
		throwErr('version must be a valid semver version string', prefix);
	}
}

function validateVersionRange(version, prefix) {
	if (!isFullString(version) || !validSemverRange(version)) {
		throwErr('version must be a valid semver range version string', prefix);
	}
}

function validateExtend(extend, prefix) {
	if (!isFunction(extend)) throwErr('extend must be a function', prefix);
}

function validateDependencies(dependencies, prefix) {
	if (!isObject(dependencies)) throwErr('dependencies must be an object', prefix);

	for (const key in dependencies) {
		validateVersionRange(dependencies[key], addPrefix(prefix, `dependencies.${key}`));
	}
}

// Throw TypeError
function throwErr(msg, prefix) {
	throw new TypeError(addPrefix(prefix, msg));
}

function addPrefix(prefix, msg) {
	if (!prefix) return msg;
	return `${prefix}.${msg}`;
}
