/* --------------------
 * class-extension module
 * Tests ESLint config
 * ------------------*/

'use strict';

// Exports

module.exports = {
	extends: [
		'@overlookmotel/eslint-config-jest'
	],
	rules: {
		'import/no-unresolved': ['error', {ignore: ['^class-extension$']}],
		'node/no-missing-require': ['error', {allowModules: ['class-extension']}]
	}
};
