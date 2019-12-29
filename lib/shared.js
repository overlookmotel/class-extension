/* --------------------
 * class-extension module
 * Shared methods
 * ------------------*/

'use strict';

// Modules
const {isObject, isFunction, isFullString} = require('is-it-type'),
	{valid: validSemver, validRange: validSemverRange} = require('semver');

// Exports
module.exports = {
	validateClass,
	validateExtension,
	validateInstance,
	validateName,
	validateVersion,
	validateExtend,
	validateDependencies
};

function validateClass(Class) {
	if (!isFunction(Class)) throwErr('Class is not a function');
}

function validateExtension(extension) {
	if (!isObject(extension)) throwErr('extension must be an object');
	if (extension.name != null) {
		validateName(extension.name, 'extension');
		validateVersion(extension.version, 'extension');
	}
	validateExtend(extension.extend, 'extension');
	validateDependencies(extension.dependencies, 'extension');
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

	prefix = conformPrefix(prefix);
	for (const key in dependencies) {
		validateVersionRange(dependencies[key], `${prefix}dependencies.${key}`);
	}
}

// Throw TypeError
function throwErr(msg, prefix) {
	throw new TypeError(`${conformPrefix(prefix)}${msg}`);
}

function conformPrefix(prefix) {
	if (!prefix) return '';
	return `${prefix}.`;
}
