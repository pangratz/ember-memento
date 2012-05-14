require('jquery');
require('ember');

require('ember-skeleton/memento');

var get = Ember.get;
var set = Ember.set;
var obj;

module("ember-memento", {
    teardown: function() {
        if (obj) {
            obj.destroy();
            obj = null;
        }
    }
});

test("Memento is defined",
function() {
    ok(typeof Memento !== undefined, "Memento is undefined");
});

test("it works with string properties",
function() {
    obj = Ember.Object.create(Memento, {
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
    obj = Ember.Object.create(Memento, {
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
    obj = Ember.Object.create(Memento, {
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
    obj = Ember.Object.create(Memento, {
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
    obj = Ember.Object.create(Memento, {
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
    obj = Ember.Object.create(Memento, {
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
    obj = Ember.Object.create(Memento, {
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