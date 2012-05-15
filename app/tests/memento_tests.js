require('jquery');
require('ember');

require('ember-memento/memento');

var get = Ember.get;
var set = Ember.set;
var obj;

var cleanObj = function() {
    if (obj) {
        obj.destroy();
        obj = null;
    }
};

module("ember-memento", {
    teardown: cleanObj
});

test("Memento is defined",
function() {
    ok(typeof Ember.Memento !== undefined, "Memento is defined");
});

test("it works with string properties",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'name'.w(),

        name: 'hansi'
    });

    equal(get(obj, 'name'), 'hansi', 'precond - name is defined');

    set(obj, 'name', 'hubert');
    equal(get(obj, 'name'), 'hubert', 'name has changed');

    obj.undo();
    equal(get(obj, 'name'), 'hansi', 'name has changed');

    obj.undo();
    equal(get(obj, 'name'), 'hansi', 'name has not changed');

    obj.redo();
    equal(get(obj, 'name'), 'hubert', 'name has changed');

    obj.redo();
    equal(get(obj, 'name'), 'hubert', 'name has not changed');
});

test("it works with number properties",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'age'.w(),

        age: 10
    });

    equal(get(obj, 'age'), 10, 'precond - age is defined');

    set(obj, 'age', 15);
    equal(get(obj, 'age'), 15, 'age has changed');

    obj.undo();
    equal(get(obj, 'age'), 10, 'age has changed');

    obj.undo();
    equal(get(obj, 'age'), 10, 'age has not changed');

    obj.redo();
    equal(get(obj, 'age'), 15, 'age has changed');

    obj.redo();
    equal(get(obj, 'age'), 15, 'age has not changed');
});

test("it works with array properties",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'array'.w(),

        array: []
    });

    deepEqual(get(obj, 'array'), [], 'precond - array is defined');

    get(obj, 'array').pushObject(1);
    deepEqual(get(obj, 'array'), [1], 'array has changed');

    obj.undo();
    deepEqual(get(obj, 'array'), [], 'array has changed');

    obj.undo();
    deepEqual(get(obj, 'array'), [], 'arary has not changed');

    obj.redo();
    deepEqual(get(obj, 'array'), [1], 'array has changed');

    obj.redo();
    deepEqual(get(obj, 'array'), [1], 'array has not changed');
});

test("it works with array#pushObjects",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'array'.w(),

        array: []
    });

    get(obj, 'array').pushObjects([1, 2]);
    deepEqual(get(obj, 'array'), [1, 2], "precond - array is modified");

    obj.undo();
    deepEqual(get(obj, 'array'), [], "array has been reset");

    obj.undo();
    deepEqual(get(obj, 'array'), [], "array has not changed");

    obj.redo();
    deepEqual(get(obj, 'array'), [1, 2], "array has changed");

    obj.redo();
    deepEqual(get(obj, 'array'), [1, 2], "array has not changed");
});

test("it works with array#popObject",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'array'.w(),

        array: [1, 2]
    });

    get(obj, 'array').popObject();
    deepEqual(get(obj, 'array'), [1], "precond - array is modified");

    obj.undo();
    deepEqual(get(obj, 'array'), [1, 2], "array has been reset");

    obj.undo();
    deepEqual(get(obj, 'array'), [1, 2], "array has not changed");

    obj.redo();
    deepEqual(get(obj, 'array'), [1], "array has changed");

    obj.redo();
    deepEqual(get(obj, 'array'), [1], "array has not changed");
});

test("it works with multiple properties",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str bool num arr'.w(),

        str: 'string',
        bool: false,
        num: 1,
        arr: [1, 2, 3]
    });

    obj.set('str', 'newString');
    obj.set('bool', true);
    obj.set('num', 2);
    obj.get('arr').pushObject(4);
    obj.get('arr').unshiftObject(0);

    equal(get(obj, 'str'), 'newString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [0, 1, 2, 3, 4]);

    obj.undo();

    equal(get(obj, 'str'), 'newString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [1, 2, 3, 4]);

    obj.undo();

    equal(get(obj, 'str'), 'newString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [1, 2, 3]);

    obj.undo();

    equal(get(obj, 'str'), 'newString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 1);
    deepEqual(get(obj, 'arr'), [1, 2, 3]);

    obj.redo();

    equal(get(obj, 'str'), 'newString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [1, 2, 3]);

    obj.redo();

    equal(get(obj, 'str'), 'newString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [1, 2, 3, 4]);

    obj.set('str', 'newerString');

    equal(get(obj, 'str'), 'newerString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [1, 2, 3, 4]);

    obj.undo();

    equal(get(obj, 'str'), 'newString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [1, 2, 3, 4]);

    obj.redo();

    equal(get(obj, 'str'), 'newerString');
    equal(get(obj, 'bool'), true);
    equal(get(obj, 'num'), 2);
    deepEqual(get(obj, 'arr'), [1, 2, 3, 4]);
});

test("it allows rewriting of history",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'a'
    });

    // the following tests the case: a -> b -> c -> undo: b -> d -> e -> undo: d -> undo: b -> redo: d -> redo e
    equal(get(obj, 'str'), 'a');

    obj.set('str', 'b');
    equal(get(obj, 'str'), 'b');

    obj.set('str', 'c');
    equal(get(obj, 'str'), 'c');

    obj.undo();
    equal(get(obj, 'str'), 'b');

    obj.set('str', 'd');
    equal(get(obj, 'str'), 'd');

    obj.set('str', 'e');
    equal(get(obj, 'str'), 'e');

    obj.undo();
    equal(get(obj, 'str'), 'd');

    obj.undo();
    equal(get(obj, 'str'), 'b');

    obj.redo();
    equal(get(obj, 'str'), 'd');

    obj.redo();
    equal(get(obj, 'str'), 'e');
});

test("it only works with properties defined in mementoProperties",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'a',
        otherStr: 'hello'
    });

    equal(get(obj, 'str'), 'a');
    equal(get(obj, 'otherStr'), 'hello');

    obj.set('str', 'b');

    equal(get(obj, 'str'), 'b');
    equal(get(obj, 'otherStr'), 'hello');

    obj.set('otherStr', 'hello world');

    equal(get(obj, 'str'), 'b');
    equal(get(obj, 'otherStr'), 'hello world');

    obj.undo();

    equal(get(obj, 'str'), 'a');
    equal(get(obj, 'otherStr'), 'hello world');

    obj.redo();

    equal(get(obj, 'str'), 'b');
    equal(get(obj, 'otherStr'), 'hello world');
});

test("it works when a new array is set",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'arr'.w(),

        arr: [1, 2, 3]
    });

    obj.get('arr').pushObject(4);
    deepEqual(get(obj, 'arr'), [1, 2, 3, 4], 'precond - array pushObject works');
    obj.undo();
    deepEqual(get(obj, 'arr'), [1, 2, 3], 'precond - undo on array works');

    // reset to new array
    obj.set('arr', []);
    deepEqual(get(obj, 'arr'), [], 'new array is set');

    obj.undo();
    deepEqual(get(obj, 'arr'), [1, 2, 3], 'undo works with newly set array');

    obj.redo();
    deepEqual(get(obj, 'arr'), [], 'redo works with newly set array');

    get(obj, 'arr').pushObjects(['a', 'b']);
    deepEqual(get(obj, 'arr'), ['a', 'b'], 'array operations work on newly set array');

    obj.undo();
    deepEqual(get(obj, 'arr'), [], 'undo works with newly set array');

    obj.redo();
    deepEqual(get(obj, 'arr'), ['a', 'b'], 'redo works with newly set array');
});

test("it removes itself as listener on arrays which are replaced",
function() {
    var firstArray = [1, 2, 3];
    var secondArray = ['a', 'b'];
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'arr'.w(),

        arr: firstArray
    });

    equal(get(firstArray, 'hasArrayObservers'), true, 'precond - firstArray has array observers');
    equal(get(secondArray, 'hasArrayObservers'), false, 'precond - secondArray has no array observers');

    obj.set('arr', secondArray);

    equal(get(firstArray, 'hasArrayObservers'), false, 'firstArray has no array observers');
    equal(get(secondArray, 'hasArrayObservers'), true, 'secondArray has array observers');

    set(obj, 'arr', []);

    equal(get(firstArray, 'hasArrayObservers'), false, 'firstArray has no array observers');
    equal(get(secondArray, 'hasArrayObservers'), false, 'secondArray has no array observers');
});

module("clearHistory", {
    teardown: cleanObj
});

test("it clears the whole history",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'frozen'
    });

    set(obj, 'str', 'frozen banana');
    equal(get(obj, 'str'), 'frozen banana');

    set(obj, 'str', 'Frozen Banana');
    equal(get(obj, 'str'), 'Frozen Banana');

    obj.clearHistory();
    equal(get(obj, 'str'), 'Frozen Banana', 'clearHistory does not affect property');

    obj.undo();
    equal(get(obj, 'str'), 'Frozen Banana', 'undo does not change the property since history is cleared');

    obj.redo();
    equal(get(obj, 'str'), 'Frozen Banana', 'redo does not change the property since history is cleared');
});

test("it clears the whole history, even when gone back in time",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'frozen'
    });

    set(obj, 'str', 'frozen banana');
    equal(get(obj, 'str'), 'frozen banana');

    set(obj, 'str', 'Frozen Banana');
    equal(get(obj, 'str'), 'Frozen Banana');

    obj.undo();
    equal(get(obj, 'str'), 'frozen banana');

    obj.clearHistory();
    equal(get(obj, 'str'), 'frozen banana', 'clearHistory does not affect property');

    obj.undo();
    equal(get(obj, 'str'), 'frozen banana', 'undo does not change the property since history is cleared');

    obj.redo();
    equal(get(obj, 'str'), 'frozen banana', 'redo does not change the property since history is cleared');
});

test("count parameter specifies how many past items shall be kept",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'frozen'
    });

    set(obj, 'str', 'frozen banana');
    set(obj, 'str', 'Frozen Banana');
    equal(get(obj, 'str'), 'Frozen Banana');

    obj.clearHistory(1);
    equal(get(obj, 'str'), 'Frozen Banana', 'clearHistory does not affect property');

    obj.undo();
    equal(get(obj, 'str'), 'frozen banana', 'undo works as expected');

    obj.undo();
    equal(get(obj, 'str'), 'frozen banana', 'undo works as expected');

    obj.redo();
    equal(get(obj, 'str'), 'Frozen Banana', 'redo works as expected');
});

test("a negative count parameter does not clear the history",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'frozen'
    });

    set(obj, 'str', 'frozen banana');
    set(obj, 'str', 'Frozen Banana');
    equal(get(obj, 'str'), 'Frozen Banana');

    obj.clearHistory( - 1);
    equal(get(obj, 'str'), 'Frozen Banana', 'clearHistory does not affect property');

    obj.undo();
    equal(get(obj, 'str'), 'frozen banana', 'undo works as expected');

    obj.undo();
    equal(get(obj, 'str'), 'frozen', 'undo works as expected');
});

test("a too large count parameter works",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'frozen'
    });

    set(obj, 'str', 'frozen banana');
    set(obj, 'str', 'Frozen Banana');
    equal(get(obj, 'str'), 'Frozen Banana');

    obj.clearHistory(5);
    equal(get(obj, 'str'), 'Frozen Banana', 'clearHistory does not affect property');

    obj.undo();
    equal(get(obj, 'str'), 'frozen banana', 'undo works as expected');

    obj.undo();
    equal(get(obj, 'str'), 'frozen', 'undo works as expected');

    obj.undo();
    equal(get(obj, 'str'), 'frozen', 'undo works as expected');

    obj.redo();
    equal(get(obj, 'str'), 'frozen banana', 'redo works as expected');

    obj.redo();
    equal(get(obj, 'str'), 'Frozen Banana', 'redo works as expected');
});


test("clearHistory works when no history is available",
function() {
    obj = Ember.Object.create(Ember.Memento, {
        mementoProperties: 'str'.w(),

        str: 'frozen'
    });

    obj.clearHistory();
    equal(get(obj, 'str'), 'frozen', 'clearHistory does not affect property');

    obj.undo();
    equal(get(obj, 'str'), 'frozen', 'undo works as expected');

    obj.redo();
    equal(get(obj, 'str'), 'frozen', 'undo works as expected');
});