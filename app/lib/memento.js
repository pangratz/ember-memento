Ember.Memento = Ember.Mixin.create({
    // holds all history items
    _memento: [],

    // current history index
    _mementoIndex: -1,

    _addHistory: function(history) {
        /**
         * since _addHistory is invoked on every property change,
         * we have to check if the property value is set from within
         * a "undo" or "redo", and if so, we don't add another history item
         */
        if (!this.get('_isUndo')) {
            /**
             * check if a value has been changed while we have gone
             * back in time via "undo". if so, we delete all history items
             * after the current one
             */
            var mementoIndex = this.get('_mementoIndex');
            var lastIndex = this.getPath('_memento.length') - 1;
            var diff = lastIndex - mementoIndex;
            if (mementoIndex !== lastIndex && diff !== 0) {
                this.get('_memento').replace(mementoIndex + 1, lastIndex - mementoIndex);
            }

            // add new history item and increase current history index
            this.get('_memento').pushObject(history);
            this.incrementProperty('_mementoIndex');
        }
    },

    /**
     * Go back in time
     */
    undo: function() {
        this.set('_isUndo', true);
        // check if we can go back in time
        var mementoIndex = this.get('_mementoIndex');
        if (mementoIndex >= 0) {
            var historyItem = this.get('_memento').objectAt(mementoIndex);
            historyItem.undo();
            this.decrementProperty('_mementoIndex');
        }
        this.set('_isUndo', false);
    },

    /**
     * Redo a step in history
     */
    redo: function() {
        this.set('_isUndo', true);
        // check if we can do a step into future
        var mementoIndex = this.get('_mementoIndex');
        var historyLength = this.getPath('_memento.length');
        if (mementoIndex < historyLength - 1) {
            mementoIndex = this.incrementProperty('_mementoIndex');
            var historyItem = this.get('_memento').objectAt(mementoIndex);
            historyItem.redo();
        }
        this.set('_isUndo', false);
    },

    init: function() {
        // iterate over all mementoProperties and add observers
        var props = this.get('mementoProperties');
        props.forEach(function(item) {
            var prop = Ember.get(this, item);
            // check if the property is an array
            if (Ember.typeOf(prop) === 'array') {
                prop.addArrayObserver(this);
            } else {
                Ember.addBeforeObserver(this, item, this, '_beforePropertyChange');
                Ember.addObserver(this, item, this, '_propertyChanged');
            }
        },
        this);
    },

    // temporarily save the value which will be changed
    _beforePropertyChange: function(obj, propName) {
        var val = Ember.get(obj, propName);
        this.set('_beforeValue', val);
    },

    // invoked when a "normal" property has been changed
    _propertyChanged: function(obj, propName) {
        var val = Ember.get(obj, propName);
        var beforeValue = Ember.get(this, '_beforeValue');
        this._addHistory({
            undoDescription: 'set %@ to "%@"'.fmt(propName, beforeValue),
            redoDescription: 'set %@ to %@'.fmt(propName, val),
            undo: function() {
                Ember.set(obj, propName, beforeValue);
            },
            redo: function() {
                Ember.set(obj, propName, val);
            }
        });
    },

    arrayWillChange: function(array, startIndex, rmCount, addCount) {
        // check if some elements will be removed from array
        if (rmCount !== 0) {
            var elements = array.slice(startIndex, startIndex + rmCount);
            this._addHistory({
                undoDescription: 'add %@ elements [%@] at %@'.fmt(rmCount, elements, startIndex),
                redoDescription: 'remove %@ elements [%@] at %@'.fmt(rmCount, elements, startIndex),
                undo: function() {
                    array.replace(startIndex, 0, elements);
                },
                redo: function() {
                    array.replace(startIndex, rmCount);
                }
            });
        }
    },
    arrayDidChange: function(array, startIndex, rmCount, addCount) {
        // check if some elements have been added to array
        if (addCount !== 0) {
            var elements = array.slice(startIndex, startIndex + addCount);
            this._addHistory({
                undoDescription: 'remove %@ elements [%@] at %@'.fmt(addCount, elements, startIndex),
                redoDescription: 'add %@ elements [%@] at %@'.fmt(addCount, elements, startIndex),
                undo: function() {
                    array.replace(startIndex, addCount);
                },
                redo: function() {
                    array.replace(startIndex, 0, elements);
                }
            });
        }
    }
});