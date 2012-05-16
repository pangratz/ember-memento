Ember-Memento [![Build Status](https://secure.travis-ci.org/pangratz/ember-memento.png)](http://travis-ci.org/pangratz/ember-memento)
==============

A mixin for Ember.js which adds undo/redo functionality to `Ember.Object`'s.

Added functionality to an object with the `Ember.Memento` mixin:

* [undo](#undo) and [redo](#redo) functionality
* [mementoSize](#mementosize) to limit amount of saved history states
* [clearHistory](#clearhistory) to clear history and optionally keep a given amount of states
* [updateProperties](#updateproperties) to update multiple properties and only keep 1 history state

Usage
-----

Add the mixin, located in `app/lib/memento.js` to your project.

The mixin works with properties of type 'string', 'number', 'boolean' and 'array'.

Use it in your objects which shall offer the functionality like this, see [JSFiddle](http://jsfiddle.net/pangratz666/Dbvhe/):

```javascript
var obj = Ember.Object.create(Ember.Memento, {
    // array of properties which shall be considered in undo/redo
    mementoProperties: 'firstName lastName age tags',

    firstName: 'Buster',
    age: 35,
    tags: ['cartographer']
});

// firstName = 'Buster', lastName = undefined, age = 35, tags = ['brother', 'cartographer']
obj.getProperties('firstName lastName age tags'.w());
```

Properties are modified as usual via Ember.js `setter`'s

```javascript
obj.set('lastName', 'Bluth');
obj.get('tags').pushObject('step-brother');
obj.set('firstName', 'Baby Buster');

// firstName = 'Baby Buster', lastName = 'Bluth', age = 35, tags = ['cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());
```

#### undo

To undo a change, simply call `undo` on the object:

```javascript
// undo last change of firstName
obj.undo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// undo last change of adding 'step-brother' to tags array
obj.undo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['cartographer']
obj.getProperties('firstName lastName age tags'.w());

// check if an undo is possible
if (obj.get('canUndo')) {
    ...
}

// get the number of steps which can be undone
var numOfPossibleUndos = obj.get('undoCount');
```

#### redo

To redo a change, simply call `redo` on the object:

```javascript
// redo change and re-add 'step-brother'
obj.redo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// redo the change to firstName
obj.redo();

// firstName = 'Baby Buster', lastName = 'Bluth', age = 35, tags = ['cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// check if a redo is possible
if (obj.get('canRedo')) {
    ...
}

// get the number of steps which can be redone
var numOfPossibleRedos = obj.get('redoCount');
```

#### mementoSize

By specifying a property `mementoSize` you define how many history states should be remembered. By default, the whole history is saved:

```javascript
// only save the latest 2 history states
obj.set('mementoSize', 2);

obj.set('firstName', 'Tobias');
obj.set('firstName', 'Tobias Fünke');
obj.set('firstName', 'Dr. Tobias Fünke');
obj.set('firstName', 'Nelly');

obj.undo(); // firstName = 'Dr. Tobias Fünke'
obj.undo(); // firstName = 'Tobias Fünke'
obj.get('canUndo'); // false
```

#### clearHistory

The history can be cleared via `clearHistory` method. If no parameter is specified, the whole history is cleared. You can also pass the number of history items which shall be kept:

```javascript
obj.set('firstName', 'Tobias');
obj.set('firstName', 'Tobias Fünke');

// compact history and only keep 1 item
obj.clearHistory(1);

obj.undo(); // changes firstName to 'Tobias'
obj.undo(); // does nothing since there are no more history items
```

#### updateProperties

To change multiple properties and only add 1 history item, use the `updateProperties` method:

```javascript
obj.set('firstName', 'Buster');
obj.set('age', 100);

// update multiple properties at once, but create only 1 histroy item
obj.updateProperties({
    firstName: 'Baby Buster',
    age: 42
});

// firstName = 'Baby Buster', age = 42
obj.getProperties('firstName age'.w());

// undo last change
obj.undo();

// firstName = 'Buster', age = 100
obj.getProperties('firstName age'.w());
```

Development
-----------

The mixin is located at [`app/lib/memento.js`](https://github.com/pangratz/ember-memento/blob/master/app/lib/memento.js) and the corresponding tests are at `app/tests/`.

Test
----

You can test the mixin via:

    $ bundle install 
    $ bundle exec rake test

Or if you're on a Mac, via:

    $ bundle exec rake autotest

This executes the tests by using [Phantom.JS](http://www.phantomjs.org/), which you need to have installed.

Or you can run the tests via:

    $ bundle exec rackup
    $ open http://localhost:9292/tests/index.html


Thanks
------

This project's layout is based on the fabulous [interline/ember-skelton](https://github.com/interline/ember-skeleton)