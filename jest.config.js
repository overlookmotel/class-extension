'use strict';

module.exports = {
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['index.js', 'lib/**/*.js'],
	setupFilesAfterEnv: ['jest-extended']
};
