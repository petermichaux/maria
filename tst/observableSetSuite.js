(function() {

    buster.testCase('observableSetSuite', {

        "test has, add, and delete still work": function() {

            var s = new LIB_ObservableSet();

            assert.same(false, s.has('alpha'), 'alpha not in set to start.');
            assert.same(false, s.delete('alpha'), 'deleting alpha not in set returns false.');
            assert.same(true, s.add('alpha'), 'adding alpha to set returns true.');
            assert.same(true, s.has('alpha'), 'alpha is now in the set.');
            assert.same(false, s.add('alpha'), 'adding alpha again to set returns false.');
            assert.same(true, s.delete('alpha'), 'deleting alpha in set returns true.');

        },

        "test add no items": function() {
            var s = new LIB_ObservableSet();
            assert.same(false, s.add(), "adding nothing should work and return false");
        },

        "test delete no items": function() {
            var s = new LIB_ObservableSet('alpha', 'beta');
            assert.same(false, s['delete'](), "deleting nothing should work and return false");
        },

        "test add and delete events dispatched": function() {

            var s = new LIB_ObservableSet();

            var additions = 0;
            s.addEventListener('LIB_add', function(){additions++;});
            var deletions = 0;
            s.addEventListener('LIB_delete', function(){deletions++;});

            assert.same(0, additions, 'no additions to start.');
            assert.same(0, deletions, 'no deletions to start.');
            s.add('alpha');
            assert.same(0, deletions, 'no deletions after first addition.');
            assert.same(1, additions, 'when adding an item not in the list, listeners are called.');
            s.add('alpha');
            assert.same(0, deletions, 'no deletions after failed addition.');
            assert.same(1, additions, 'when adding an item in the list, listeners not called.');
            s.delete('alpha');
            assert.same(1, additions, 'still 1 addition after first delete.')
            assert.same(1, deletions, 'when deleting an item in the list, listeners are called.');
            s.delete('alpha');
            assert.same(1, additions, 'still 1 addition after failed delete.')
            assert.same(1, deletions, 'when deleting an item now in the list, listeners not called.');

        },

        "test add delete multiple elements in one call": function() {

            var s = new LIB_ObservableSet();

            var addEvents = 0;
            var deleteEvents = 0;

            s.addEventListener('LIB_add', function() {
                addEvents++;
            });

            s.addEventListener('LIB_delete', function() {
                deleteEvents++;
            });

            assert.same(false, s.has('alpha'), 'alpha not in set to start.');
            assert.same(false, s.has('beta'), 'beta not in set to start.');
            assert.same(true, s.add('alpha', 'beta'), 'adding alpha and beta to set should work');
            assert.same(true, s.has('alpha'), 'alpha now in set.');
            assert.same(true, s.has('beta'), 'beta now in set.');
            assert.same(1, addEvents, 'two items added to set but only one event fired.');

            assert.same(false, s.add('alpha'), 'adding alpha again does not do anything');
            assert.same(1, addEvents, 'add event not fired.');

            assert.same(true, s['delete']('alpha', 'beta'), 'deleting alpha and beta to set should work');
            assert.same(1, deleteEvents, 'two items deleted to set but only one event fired.');

            assert.same(false, s.has('alpha'), 'alpha not in set to end.');
            assert.same(false, s.has('beta'), 'beta not in set to end.');

            assert.same(false, s['delete']('alpha'), 'deleting alpha again should not do anything');
            assert.same(1, deleteEvents, 'delete event not fired.');

        },

        "test filter and map return ObservableSet objects": function() {

            var s = new LIB_ObservableSet();
            s.add('alpha');
            s.add('beta');
            var t = s.filter(function(element) {return element === 'alpha'});
            assert.same(LIB_ObservableSet, t.constructor);

        },

        "test automatic bubbling": function() {

            var child = new evento.EventTarget();
            var parent = new LIB_ObservableSet();
            var root = new LIB_ObservableSet();

            var resultChild;
            var resultParent;
            var resultRoot;

            child.addEventListener('foo', function(ev) {
                resultChild = ev;
            });

            parent.addEventListener('foo', function(ev) {
                resultParent = ev;
            });

            root.addEventListener('foo', function(ev) {
                resultRoot = ev;
            });

            resultChild = resultParent = resultRoot = null;
            child.dispatchEvent({type: 'foo'});
            assert(resultChild, 'phase I: the child should have received the event');
            assert(!resultParent, 'phase I: the parent should not have received the event');
            assert(!resultRoot, 'phase I: the root should not have received the event');
            
            resultChild = resultParent = resultRoot = null;
            parent.add(child);
            child.dispatchEvent({type: 'foo'});
            assert(resultChild, 'phase II: the child should have received the event');
            assert(resultParent, 'phase II: the parent should have received the event');
            assert(!resultRoot, 'phase II: the root should not have received the event');
            
            resultChild = resultParent = resultRoot = null;
            root.add(parent);
            child.dispatchEvent({type: 'foo'});
            assert(resultChild, 'phase III: the child should have received the event');
            assert(resultParent, 'phase III: the parent should have received the event');
            assert(resultRoot, 'phase III: the root should not have received the event');
            
            assert.same(resultChild.target, child);
            assert.same(resultChild.currentTarget, child);
            assert.same(resultParent.target, child);
            assert.same(resultParent.currentTarget, parent);
            assert.same(resultRoot.target, child);
            assert.same(resultRoot.currentTarget, root);

        },

        "test LIB_add does not bubble and LIB_afterAdd does bubble": function() {
            var childSet = new LIB_ObservableSet();
            var parentSet = new LIB_ObservableSet();
            var addBubbled = false;
            var afterAddBubbled = true;
            parentSet.add(childSet);
            parentSet.addEventListener('LIB_add', function(ev) {
                addBubbled = true;
            });
            parentSet.addEventListener('LIB_afterAdd', function(ev) {
                afterAddBubbled = true;
            });
            childSet.add('alpha');
            assert.same(false, addBubbled, 'the parent set should not know an element is added to the child set');
            assert.same(true, afterAddBubbled, 'the parent set should know *after* an element is added to the child set');
        },

        "test LIB_delete does not bubble and LIB_afterDelete does bubble": function() {
            var childSet = new LIB_ObservableSet();
            var parentSet = new LIB_ObservableSet();
            var deleteBubbled = false;
            var afterDeleteBubbled = true;
            parentSet.add(childSet);
            parentSet.addEventListener('LIB_delete', function(ev) {
                deleteBubbled = true;
            });
            parentSet.addEventListener('LIB_afterDelete', function(ev) {
                afterDeleteBubbled = true;
            });
            childSet.add('alpha');
            childSet['delete']('alpha');
            assert.same(false, deleteBubbled, 'the parent set should not know an element is deleted from the child set');
            assert.same(true, afterDeleteBubbled, 'the parent set should know *after* an element is deleted from the child set');
        },

        "test LIB_delete does not bubble and LIB_afterDelete does bubble when emptying": function() {
            var childSet = new LIB_ObservableSet();
            var parentSet = new LIB_ObservableSet();
            var deleteBubbled = false;
            var afterDeleteBubbled = true;
            parentSet.add(childSet);
            parentSet.addEventListener('LIB_delete', function(ev) {
                deleteBubbled = true;
            });
            parentSet.addEventListener('LIB_afterDelete', function(ev) {
                afterDeleteBubbled = true;
            });
            childSet.add('alpha');
            childSet.empty();
            assert.same(false, deleteBubbled, 'the parent set should not know an element is deleted from the child set when emptying the child set');
            assert.same(true, afterDeleteBubbled, 'the parent set should know *after* an element is deleted from the child set when emptying the child set');
        },

        "test destroy event on element removes it from the set": function() {
            var element = new evento.EventTarget();
            var set = new LIB_ObservableSet();
            set.add(element);
            assert.same(1, set.length, "the set should contain the element and so have length 1");
            assert.same(true, set.has(element), "the set should contain the element");
            element.dispatchEvent({type: 'LIB_destroy'});
            assert.same(0, set.length, "the set should not contain the element and so should have length 0");
            assert.same(false, set.has(element), "the set should not contain the element");
        },

        "test empty dispatches events": function() {
            var s = new LIB_ObservableSet('alpha', 'beta');
            var deleteEvents = 0;
            s.addEventListener('LIB_delete', function() {
                deleteEvents++;
            });
            s.empty();
            assert.same(1, deleteEvents, "the delete listener should have been called only once");
        },

        "test empty removes listeners from subject elements": function() {
            var element = new evento.EventTarget();
            var set = new LIB_ObservableSet();
            set.add(element);
            
            var calls = 0;
            set.addEventListener('foo', function(ev) {
                calls++;
            });
            element.dispatchEvent({type: 'foo'});
            assert.same(1, calls, "the element listener from the set should have been called when the element is in the set");
            set.empty();
            element.dispatchEvent({type: 'foo'});
            assert.same(1, calls, "the element listener from the set should not have been called after emptying the set");
            
        }

    });

}());
