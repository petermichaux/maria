var observableSetSuite;

(function() {

    observableSetSuite = {
        suiteName: 'observableSetSuite',

        "test has, add, and delete still work": function() {

            var s = new LIB_ObservableSet();

            jsUnity.assertIdentical(false, s.has('alpha'), 'alpha not in set to start.');
            jsUnity.assertIdentical(false, s.delete('alpha'), 'deleting alpha not in set returns false.');
            jsUnity.assertIdentical(true, s.add('alpha'), 'adding alpha to set returns true.');
            jsUnity.assertIdentical(true, s.has('alpha'), 'alpha is now in the set.');
            jsUnity.assertIdentical(false, s.add('alpha'), 'adding alpha again to set returns false.');
            jsUnity.assertIdentical(true, s.delete('alpha'), 'deleting alpha in set returns true.');

        },

        "test add no items": function() {
            var s = new LIB_ObservableSet();
            jsUnity.assertIdentical(false, s.add(), "adding nothing should work and return false");
        },

        "test delete no items": function() {
            var s = new LIB_ObservableSet('alpha', 'beta');
            jsUnity.assertIdentical(false, s['delete'](), "deleting nothing should work and return false");
        },

        "test add and delete events dispatched": function() {

            var s = new LIB_ObservableSet();

            var additions = 0;
            s.addEventListener('LIB_add', function(){additions++;});
            var deletions = 0;
            s.addEventListener('LIB_delete', function(){deletions++;});

            jsUnity.assertIdentical(0, additions, 'no additions to start.');
            jsUnity.assertIdentical(0, deletions, 'no deletions to start.');
            s.add('alpha');
            jsUnity.assertIdentical(0, deletions, 'no deletions after first addition.');
            jsUnity.assertIdentical(1, additions, 'when adding an item not in the list, listeners are called.');
            s.add('alpha');
            jsUnity.assertIdentical(0, deletions, 'no deletions after failed addition.');
            jsUnity.assertIdentical(1, additions, 'when adding an item in the list, listeners not called.');
            s.delete('alpha');
            jsUnity.assertIdentical(1, additions, 'still 1 addition after first delete.')
            jsUnity.assertIdentical(1, deletions, 'when deleting an item in the list, listeners are called.');
            s.delete('alpha');
            jsUnity.assertIdentical(1, additions, 'still 1 addition after failed delete.')
            jsUnity.assertIdentical(1, deletions, 'when deleting an item now in the list, listeners not called.');

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

            jsUnity.assertIdentical(false, s.has('alpha'), 'alpha not in set to start.');
            jsUnity.assertIdentical(false, s.has('beta'), 'beta not in set to start.');
            jsUnity.assertIdentical(true, s.add('alpha', 'beta'), 'adding alpha and beta to set should work');
            jsUnity.assertIdentical(true, s.has('alpha'), 'alpha now in set.');
            jsUnity.assertIdentical(true, s.has('beta'), 'beta now in set.');
            jsUnity.assertIdentical(1, addEvents, 'two items added to set but only one event fired.');

            jsUnity.assertIdentical(false, s.add('alpha'), 'adding alpha again does not do anything');
            jsUnity.assertIdentical(1, addEvents, 'add event not fired.');

            jsUnity.assertIdentical(true, s['delete']('alpha', 'beta'), 'deleting alpha and beta to set should work');
            jsUnity.assertIdentical(1, deleteEvents, 'two items deleted to set but only one event fired.');

            jsUnity.assertIdentical(false, s.has('alpha'), 'alpha not in set to end.');
            jsUnity.assertIdentical(false, s.has('beta'), 'beta not in set to end.');

            jsUnity.assertIdentical(false, s['delete']('alpha'), 'deleting alpha again should not do anything');
            jsUnity.assertIdentical(1, deleteEvents, 'delete event not fired.');

        },

        "test filter and map return ObservableSet objects": function() {

            var s = new LIB_ObservableSet();
            s.add('alpha');
            s.add('beta');
            var t = s.filter(function(element) {return element === 'alpha'});
            jsUnity.assertIdentical(LIB_ObservableSet, t.constructor);

        },

        "test automatic bubbling": function() {

            var child = new LIB_Subject();
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
            jsUnity.assertTrue(resultChild, 'phase I: the child should have received the event');
            jsUnity.assertTrue(!resultParent, 'phase I: the parent should not have received the event');
            jsUnity.assertTrue(!resultRoot, 'phase I: the root should not have received the event');

            resultChild = resultParent = resultRoot = null;
            parent.add(child);
            child.dispatchEvent({type: 'foo'});
            jsUnity.assertTrue(resultChild, 'phase II: the child should have received the event');
            jsUnity.assertTrue(resultParent, 'phase II: the parent should have received the event');
            jsUnity.assertTrue(!resultRoot, 'phase II: the root should not have received the event');

            resultChild = resultParent = resultRoot = null;
            root.add(parent);
            child.dispatchEvent({type: 'foo'});
            jsUnity.assertTrue(resultChild, 'phase III: the child should have received the event');
            jsUnity.assertTrue(resultParent, 'phase III: the parent should have received the event');
            jsUnity.assertTrue(resultRoot, 'phase III: the root should not have received the event');

            jsUnity.assertIdentical(resultChild.target, child);
            jsUnity.assertIdentical(resultChild.currentTarget, child);
            jsUnity.assertIdentical(resultParent.target, child);
            jsUnity.assertIdentical(resultParent.currentTarget, parent);
            jsUnity.assertIdentical(resultRoot.target, child);
            jsUnity.assertIdentical(resultRoot.currentTarget, root);

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
            jsUnity.assertIdentical(false, addBubbled, 'the parent set should not know an element is added to the child set');
            jsUnity.assertIdentical(true, afterAddBubbled, 'the parent set should know *after* an element is added to the child set');
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
            jsUnity.assertIdentical(false, deleteBubbled, 'the parent set should not know an element is deleted from the child set');
            jsUnity.assertIdentical(true, afterDeleteBubbled, 'the parent set should know *after* an element is deleted from the child set');
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
            jsUnity.assertIdentical(false, deleteBubbled, 'the parent set should not know an element is deleted from the child set when emptying the child set');
            jsUnity.assertIdentical(true, afterDeleteBubbled, 'the parent set should know *after* an element is deleted from the child set when emptying the child set');
        },

        "test destroy event on element removes it from the set": function() {
            var element = new LIB_Subject();
            var set = new LIB_ObservableSet();
            set.add(element);
            jsUnity.assertIdentical(1, set.length, "the set should contain the element and so have length 1");
            jsUnity.assertIdentical(true, set.has(element), "the set should contain the element");
            element.dispatchEvent({type: 'LIB_destroy'});
            jsUnity.assertIdentical(0, set.length, "the set should not contain the element and so should have length 0");
            jsUnity.assertIdentical(false, set.has(element), "the set should not contain the element");
        },

        "test empty dispatches events": function() {
            var s = new LIB_ObservableSet('alpha', 'beta');
            var deleteEvents = 0;
            s.addEventListener('LIB_delete', function() {
                deleteEvents++;
            });
            s.empty();
            jsUnity.assertIdentical(1, deleteEvents, "the delete listener should have been called only once");
        }

    };

}());
