Ember-Memento
==============

A mixin for Ember.js which adds undo/redo functionality to `Ember.Object`'s.

Usage
-----

Add the mixin, located in `app/lib/memento.js` to your project.

Use it in your objects which shall offer the functionality:

```javascript
var myObj = Ember.Object.create(Ember.Memento, {
	// properties which are "tracked"
	mementoProperties: 'firstName age'.w(),
	
	firstName: 'Buster',
	age: 78
});

myObj.set('firstName', 'Michael');
myObj.set('age', 100);

myObj.undo(); // firstName = Buster, age = 100
myObj.undo(); // firstName = Buster, age 78

myObj.redo(); // firstName = Michael, age 78
myObj.redo(); // firstName = Michael, age 100
```

Test
----

You can test the mixin via:

    $ bundle install 
    $ bundle exec rake test

This executes the tests by using [Phantom.JS](http://www.phantomjs.org/), which you need to have installed.

Or you can run the tests via:

    $ bundle exec rackup
    $ open http://localhost:9292/tests/index.html


Thanks
------

This project's layout is based on the fabulous [interline/ember-skelton](https://github.com/interline/ember-skeleton)