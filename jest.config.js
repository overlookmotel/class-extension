/* --------------------
 * class-extension module
 * Jest config
 * ------------------*/

'use strict';

// Exports

module.exports = {
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['index.js', 'lib/**/*.js'],
	setupFilesAfterEnv: ['jest-extended', 'jest-expect-subclass'],
	moduleNameMapper: {
		'^class-extension$': '<rootDir>/index.js'
	}
};
