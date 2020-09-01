[![NPM version](https://img.shields.io/npm/v/class-extension.svg)](https://www.npmjs.com/package/class-extension)
[![Build Status](https://img.shields.io/travis/overlookmotel/class-extension/master.svg)](http://travis-ci.org/overlookmotel/class-extension)
[![Dependency Status](https://img.shields.io/david/overlookmotel/class-extension.svg)](https://david-dm.org/overlookmotel/class-extension)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/class-extension.svg)](https://david-dm.org/overlookmotel/class-extension)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookmotel/class-extension.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/class-extension/master.svg)](https://coveralls.io/r/overlookmotel/class-extension)

# Class extensions

## What's it for?

This package provides a framework for modular class extensions. It's kind of like middleware for classes.

### Basic example

You have a class `Animal`, and you want users to be able to create re-usable extensions to that class. Use this module to add an `.extend()` method to the class.

```js
const { addMethodsToClass } = require('class-extension');

class Animal {
  constructor( name ) {
    this.name = name;
  }

  sayHello() {
    return `Hello, I am an animal called ${this.name}`;
  }
}

addMethodsToClass( Animal );
```

Create a class extension:

```js
const { Extension } = require('class-extension');

const livesInJungleExtension = new Extension( Class => (
  class extends Class {
    sayHello() {
      return super.sayHello() + ' and I live in the jungle';
    }
  }
) );
```

Now the extension can be applied to the original class to create a subclass:

```js
const JungleAnimal = Animal.extend( livesInJungleExtension );

const franz = new JungleAnimal( 'Franz' );
franz.sayHello();
// => 'Hello, I am an animal called Franz and I live in the jungle'
```

### So what's the point of all that?

You could have just extended the Animal class in less lines of code. Like this:

```js
class JungleAnimal extends Animal {
  sayHello() {
    return super.sayHello() + ' and I live in the jungle';
  }
}
```

The point is that the class extension is reuseable. It can be used to extend *other* classes too.

```js
class Man {
  constructor( name ) { this.name = name; }
  sayHello() {
    return `Hello, I am a man called ${this.name}`;
  }
}

addMethodsToClass( Man );

const JungleMan = Man.extend( livesInJungleExtension );

const george = new JungleMan( 'George' );
george.sayHello();
// => 'Hello, I am a man called George and I live in the jungle'
```

### Composing functionality

It's possible to build up complicated functionality by composing different extensions.

```js
const typeExtension = new Extension( Class => (
  class extends Class {
    setType( type ) {
      this.type = type;
    }

    sayHello() {
      return super.sayHello() + ` and I am a ${this.type}`;
    }
  }
) );

const monkeyExtension = new Extension( Class => (
  class extends Class {
    constructor( name ) {
      super( name );
      this.setType( 'monkey' );
    }
  }
) );

const Monkey = Animal.extend( typeExtension )
  .extend( livesInJungleExtension )
  .extend( monkeyExtension );

const ernie = new Monkey( 'Ernie' );
ernie.sayHello();
// => 'Hello, I am an animal called Ernie and I am a monkey and I live in the jungle'
```

### Extensions within an extension

Extensions can also depend on other extensions themselves by providing an `extends` option:

```js
const monkeyExtension = new Extension( {
  extends: [
    typeExtension,
    livesInJungleExtension
  ],
  extend: Class => class extends Class {
    constructor( name ) {
      super( name );
      this.setType( 'monkey' );
    }
  }
} );

const Monkey = Animal.extend( monkeyExtension );

const jeff = new Monkey( 'Jeff' );
jeff.sayHello();
// => 'Hello, I am an animal called Jeff and I am a monkey and I live in the jungle'
```

Or, as a shortcut, you can pass extensions array as an argument to the constructor:

```js
const monkeyExtension = new Extension(
  [ typeExtension, livesInJungleExtension ],
  Class => class extends Class {
    constructor( name ) {
      super( name );
      this.setType( 'monkey' );
    }
  }
);
```

## Usage

### `Extension` class

#### Calling the `Extension` class constructor

`Extension` constructor has a flexible call signature. It can be called with:

1. A series of arguments
2. A single options object
3. A series of options objects
4. A combination of arguments and options objects

```js
const { Extension } = require('class-extension');

// `extend` as argument
new Extension( Class => class extends Class { /* ... */ } )

// or...

// `extend` as options object property
new Extension( {
  extend(Class) {
    return class extends Class { /* ... */ };
  }
} )
```

Direct arguments take precedence over properties of options objects, and later options objects override earlier ones. e.g.:

* `( function ext1() {}, { extend: function ext2() {} } )` -> `ext1` is used.
* `( { extend: function ext1() {} }, { extend: function ext2() {} } )` -> `ext2` is used.

(see below for more arguments)

#### Extend function

Extend function will be called with two arguments:

1. `Class`: the class to extend
2. `extension`: the extension object

The function must return a subclass of `Class`.

### Equip a class for extension

Add `.extend()` (and the other methods below) to a class with:

```js
const { addMethodsToClass } = require('class-extension');
addMethodsToClass( MyClass );
```

#### `.extend()` method

`.extend()` can be called on any class which has had the method added (as above), or any of its subclasses.

`.extend()` should be called with a valid extension object, created with the `Extension` constructor (see above).

It will return a subclass of the original class it was called on.

#### `.isExtendedWith()` static method

Use to determine if a class has been extended with a particular extension.

```js
const Monkey = Animal.extend( monkeyExtension );
Monkey.isExtendedWith( monkeyExtension );
// => true
```

#### `.isExtendedWith()` prototype method

Use to determine if an object is an instance of a class which was extended with a particular extension.

```js
const Monkey = Animal.extend( monkeyExtension );
const bill = new Monkey( 'Bill' );
bill.isExtendedWith( monkeyExtension );
// => true
```

#### `.isDirectlyExtended()` static method

Use to determine if a class has been subclassed since it was last extended.

```js
const Monkey = Animal.extend( monkeyExtension );
class Baboon extends Monkey {}
Monkey.isDirectlyExtended(); // => true
Baboon.isDirectlyExtended(); // => false
```

#### `.isDirectlyExtended()` prototype method

Use to determine if an object is an instance of a class which has been subclassed since it was last extended.

```js
const Monkey = Animal.extend( monkeyExtension );
class Baboon extends Monkey {}
const bill = new Monkey( 'Bill' );
const pete = new Baboon( 'Pete' );
bill.isDirectlyExtended(); // => true
pete.isDirectlyExtended(); // => false
```

#### `.getExtensions()` static method

Get list of extensions which have been applied to a class.

```js
const Monkey = Animal.extend( monkeyExtension );
Monkey.getExtensions();
// => [ monkeyExtension ]
```

#### `.getExtensions()` prototype method

Get list of extensions which have been applied to an instance of a class.

```js
const Monkey = Animal.extend( monkeyExtension );
const bill = new Monkey( 'Bill' );
bill.getExtensions();
// => [ monkeyExtension ]
```

### Deduplication

#### Dependency deduplication

Extensions can depend on each other, forming a dependency graph.

e.g.:

* `B` uses `A`
* `C` uses `A`
* `D` uses `B` and `C`

```js
const B = new Extension(
  [ A ],
  Class => class extends Class { /* ... */ }
) );

const C = new Extension(
  [ A ],
  Class => class extends Class { /* ... */ }
) );

const D = new Extension(
  [ B, C ],
  Class => class extends Class { /* ... */ }
) );
```

So, in this example, `D` depends on `A` via two routes (a "diamond" dependency graph).

If extension `A` were applied twice, it could cause unexpected behavior.

`.extend()` deals with this problem. It recognises duplicate extensions, and avoids applying them more than once.

If you call `.extend()` on a class which is already extended with the specified extension, it returns the class unmodified, rather than applying the extension again.

```js
const SubClass = MyClass.extend( myExtension );
const SubClass2 = SubClass.extend( myExtension );
SubClass2 === SubClass // => true
```

#### Class deduplication

If you use the same series of extensions in multiple places, you could end up with multiple classes which are essentially the same. This would be a waste of memory and also cause `instanceof` not to work correctly.

So `.extend()` is memoized, so you get the same result each time.

```js
const SubClass1 = MyClass.extend( myExtension );
const SubClass2 = MyClass.extend( myExtension );
SubClass1 === SubClass2 // => true
```

### Publishing a class extension to NPM

The aim of class extensions is that they are reuseable, so it makes sense to publish them to NPM.

A published extension may depend on other published extensions itself.

However, this complicates matters. What if two modules require your extension, but due to how NPM/Yarn has built `node_modules`, they resolve to different instances of the module? `class-extension` needs some way to know these two instances are the same extension, so deduplication works properly.

Therefore, when publishing an extension, you must pass into `new Extension()` the name and version of your module. Two extensions with the same `name` will be considered to be the same.

NPM module name acts as a globally unique identifier, as it's not possible for two modules to be published under the same name on NPM.

```js
// Published to NPM as `monkey`, version 1.0.0
const { Extension } = require('class-extension');

module.exports = new Extension(
  'monkey',
  '1.0.0',
  Class => class extends Class { /* ... */ }
);
```

NB If the module is scoped, `name` should include the scope e.g. `'@monkey/magic'`.

You can alternatively pass an object to the `Extension` constructor:

```js
module.exports = new Extension( {
  name: 'monkey',
  version: '1.0.0',
  extend(Class) {
    return class extends Class { /* ... */ };
  }
} );
```

Or an object and an extend function:

```js
module.exports = new Extension(
  {
    name: 'monkey',
    version: '1.0.0'
  },
  Class => class extends Class { /* ... */ }
);
```

Conveniently, the props object has the same structure as `package.json`. So to avoid having to update the `version` property every time you publish a new version of the module, you can do:

```js
module.exports = new Extension(
  require('./package.json'),
  Class => class extends Class { /* ... */ }
);
```

The last of these forms is recommended.

NB The order of arguments is flexible - props object can also go after the extend function.

```js
module.exports = new Extension(
  Class => class extends Class { /* ... */ },
  require('./package.json')
);
```

#### Versioning

If you attempt to apply multiple different *versions* of the same extension to a class, an error will be thrown.

This is in case you're relying on some functionality of a specific version of the extension (e.g. `2.0.0`). If the extension has already been applied, but is an earlier version (e.g. `1.2.0`), it may lack this functionality.

You can loosen this restriction by providing an acceptable version range.

##### When applying an extension

Provide a `version` option to `.extend()` with a [semver version range](https://semver.npmjs.com/).

```js
const SubClass = MyClass.extend(
  monkeyExtension,
  { version: '^1.0.0' }
);
```

##### In an extension

Provide a `dependencies` option to `Extension()` constructor.

This is useful if your extension extends other extensions. Perhaps you are using version `3.4.5` of another extension, but your extension can make do with any version above `3.0.0`.

You can prevent version mismatch errors by providing the [version range](https://semver.npmjs.com/) you can accept for the dependencies.

It's generally best to keep the version range as broad as possible. Only require what your extension *needs*, not just the latest for the sake of it. This allows your extension to interoperate happily with other extensions.

```js
const livesInJungleExtension = require('lives-in-jungle');
livesInJungleExtension.version // => '3.4.5'

const monkeyExtension = new Extension( {
  name: 'monkey',
  version: '1.0.0'
  extends: [ livesInJungleExtension ],
  dependencies: {
    'lives-in-jungle': '^3.0.0'
  },
  extend: Class => class extends Class { /* ... */ }
} );
```

`dependencies` has same structure as it does in `package.json`, so you can provide `name`, `version` and `dependencies` in one go by providing `package.json` as an options object:

This has the same effect as the above example, assuming that a version range of `^3.0.0` is specified in `package.json`:

```js
const livesInJungleExtension = require('lives-in-jungle');

const monkeyExtension = new Extension(
  require('./package.json'),
  [ livesInJungleExtension ],
  Class => class extends Class { /* ... */ }
);
```

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v10+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/class-extension/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/class-extension/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)
