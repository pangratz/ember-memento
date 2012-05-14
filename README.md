Ember-Memento [![Build Status](https://secure.travis-ci.org/pangratz/ember-memento.png)](http://travis-ci.org/pangratz/ember-memento)
==============

A mixin for Ember.js which adds undo/redo functionality to `Ember.Object`'s.

Usage
-----

Add the mixin, located in `app/lib/memento.js` to your project.

The mixin works with properties of type 'string', 'number', 'boolean' and 'array'.

Use it in your objects which shall offer the functionality like this, see [JSFiddle](http://jsfiddle.net/pangratz666/Dbvhe/):

```javascript
var myObj = Ember.Object.create(Ember.Memento, {
  // properties which are "tracked"
  mementoProperties: 'firstName age tags'.w(),

  tags: ['cool', 'great'],
  firstName: 'Buster',
  age: 78
});

myObj.get('tags').pushObject('super');
myObj.set('firstName', 'Michael');
myObj.set('age', 100);

myObj.undo(); // firstName = Michael, age = 78, tags = [cool, great, super]
myObj.undo(); // firstName = Buster, age 78, tags = [cool, great, super]
myObj.undo(); // firstName = Buster, age 78, tags = [cool, great]

myObj.redo(); // firstName = Buster, age 78, tags = [cool, great, super]
myObj.redo(); // firstName = Michael, age 78, tags = [cool, great, super]
myObj.redo(); // firstName = Michael, age 100, tags = [cool, great, super]​​​```

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