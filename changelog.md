# Changelog

## 0.3.2

Features:

* Call `extension.extend` with extension as 2nd arg

## 0.3.1

Bug fixes:

* Make arguments parsing consistent

Dev:

* Update dev dependencies

## 0.3.0

Breaking changes:

* Provide extension dependencies with `extends` option
* Remove standalone functions

Features:

* Support version ranges

Bug fixes:

* Fix error when using named extension after unnamed extension

Refactor:

* Rename `shared` file to `validate`
* Refactor validation error prefixing

Dependencies:

* Update `symbols-collection` dependency

No code:

* Fix typo in code comment

Tests:

* Tests for `addMethodsToClass`
* Use `jest-expect-subclass` for testing subclassing [refactor]
* Remove repeated code [refactor]

Dev:

* Update dev dependencies

Docs:

* Amend wording
* Formatting

## 0.2.4

Bug fixes:

* Correct name of `classIsDirectlyExtended` method

## 0.2.3

Features:

* `isDirectlyExtended` methods

## 0.2.2

Features:

* `getExtensions` methods

Deps:

* Update `is-it-type` dependency
* Update `semver` dependency

No code:

* Fix code comment typos

Dev:

* Update dev dependencies

Docs:

* Fix whitespace

## 0.2.1

Bug fixes:

* Fix error on double subclassing in extension

Refactor:

* Fully specify require file paths

No code:

* File header comments

Tests:

* Run tests in dev mode
* Import from package name [refactor]

Dev:

* Update dev dependencies
* Run tests on CI on Node v14
* Replace `.npmignore` with `files` list in `package.json`
* `.editorconfig` config
* Simplify Jest config
* ESLint lint dot files
* Remove unnecessary line from `.gitignore`

## 0.2.0

Breaking changes:

* Drop support for Node v8

Dependencies:

* Update `is-it-type` dependency
* Update `symbols-collection` dependency

Dev:

* Run tests on CI on Node v13
* Remove `sudo` from Travis config
* Update dev dependencies

Docs:

* Versioning policy
* Update license year

## 0.1.0

Initial release
