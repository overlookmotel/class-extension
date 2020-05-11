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

Extensions can also depend on other extensions themselves:

```js
const monkeyExtension = new Extension( Class => {
  Class = Class.extend( typeExtension )
    .extend( livesInJungleExtension );

  return class extends Class {
    constructor( name ) {
      super( name );
      this.setType( 'monkey' );
    }
  };
} );

const Monkey = Animal.extend( monkeyExtension );

const jeff = new Monkey( 'Jeff' );
jeff.sayHello();
// => 'Hello, I am an animal called Jeff and I am a monkey and I live in the jungle'
```

## Usage

### `Extension` class

#### Calling the `Extension` class constructor

Constructor can be called with a series of arguments or an object.

```js
const { Extension } = require('class-extension');

new Extension( Class => class extends Class { /* ... */ } )

// or...

new Extension( {
  extend(Class) {
    return class extends Class { /* ... */ };
  }
} )
```

(see below for more arguments)

#### Extend function

Extend function will be called with a single argument - the class to extend.

The function must return a subclass of that class.

### Equip a class for extension

Add `.extend()` (and a few other methods) to a class with:

```js
const { addMethodsToClass } = require('class-extension');
addMethodsToClass( MyClass );
```

### `.extend()` method

`.extend()` can be called on any class which has had the method added (as above), or any of its subclasses.

`.extend()` should be called with a valid extension object, created with the `Extension` constructor (see above).

It will return a subclass of the original class it was called on.

### `.isExtendedWith()` static method

Use to determine if a class has been extended with a particular extension.

```js
const Monkey = Animal.extend( monkeyExtension );
Monkey.isExtendedWith( monkeyExtension );
// => true
```

### `.isExtendedWith()` prototype method

Use to determine if an object is an instance of a class which was extended with a particular extension.

```js
const Monkey = Animal.extend( monkeyExtension );
const bill = new Monkey( 'Bill' );
bill.isExtendedWith( monkeyExtension );
// => true
```

### Deduplication

#### Dependency deduplication

Extensions can depend on each other, forming a dependency graph.

e.g.:

* `B` uses `A`
* `C` uses `A`
* `D` uses `B` and `C`

```js
const B = new Extension( Class => (
  class extends Class.extend( A ) { /* ... */ }
) );

const C = new Extension( Class => (
  class extends Class.extend( A ) { /* ... */ }
) );

const D = new Extension( Class => (
  class extends Class.extend( B ).extend( C ) { /* ... */ }
) );
```

So, in this example, `D` depends on `A` via two routes (a "diamond" dependency graph).

If extension `A` were applied twice, it could cause unexpected behavior.

So `.extend()` recognises duplicate extensions, and avoids applying them more than once.

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

The aim of class extensions is that they are reuseable, so it makes sense the publish them to NPM.

A published extension may depend on other published extensions itself.

However, this complicates matters. What if two modules require your extension, but due to how NPM/Yarn has built `node_modules`, they resolve to different instances of the module? `class-extension` needs some way to know these two instances are the same extension, so deduplication works properly.

Therefore, when publishing an extension, you must pass into `new Extension()` the name and version of your module. Two extensions with the same `name` will be considered to be the same.

NPM module name is a globally unique identifier, as it's not possible for two modules to be published under the same name on NPM.

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

In future, a mechanism for specifying an acceptable *range* of versions may be added to `class-extension`.

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
