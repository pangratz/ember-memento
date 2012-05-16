Ember-Memento [![Build Status](https://secure.travis-ci.org/pangratz/ember-memento.png)](http://travis-ci.org/pangratz/ember-memento)
==============

A mixin for Ember.js which adds undo/redo functionality to `Ember.Object`'s.

Usage
-----

Add the mixin, located in `app/lib/memento.js` to your project.

The mixin works with properties of type 'string', 'number', 'boolean' and 'array'.

Use it in your objects which shall offer the functionality like this, see [JSFiddle](http://jsfiddle.net/pangratz666/Dbvhe/):

```javascript
var obj = Ember.Object.create(Ember.Memento, {
    // array of properties which shall be considered in undo/redo
    mementoProperties: 'firstName lastName age tags',

    // limit to 2 history states - there is no limit by default
    mementoSize: 2,

    firstName: 'Buster',
    age: 35,
    tags: ['brother', 'cartographer']
});

// firstName = 'Buster', lastName = undefined, age = 35, tags = ['brother', 'cartographer']
obj.getProperties('firstName lastName age tags'.w());

obj.set('lastName', 'Bluth');
obj.get('tags').pushObject('step-brother');
obj.set('firstName', 'Baby Buster');

// firstName = 'Baby Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// undo last change of firstName
obj.undo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// undo last change of adding 'step-brother' to tags array
obj.undo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer']
obj.getProperties('firstName lastName age tags'.w());

// invoke undo one more time; this doesn't change anything since we specified mementoSize = 2
obj.undo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer']
obj.getProperties('firstName lastName age tags'.w());

// redo change and add 'step-brother'
obj.redo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// redo change to firstName
obj.redo();

// firstName = 'Baby Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// compact history and only keep 1 item
obj.clearHistory(1);

obj.undo(); // changes firstName to 'Buster'
obj.undo(); // does nothing since there are no more history items

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// update multiple properties at once, but create only 1 histroy item
obj.updateProperties({
    firstName: 'Hey Brother Buster',
    age: 42
});

// firstName = 'Hey Brother Buster', lastName = 'Bluth', age = 42, tags = ['brother', 'cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());

// undo last change
obj.undo();

// firstName = 'Buster', lastName = 'Bluth', age = 35, tags = ['brother', 'cartographer', 'step-brother']
obj.getProperties('firstName lastName age tags'.w());
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