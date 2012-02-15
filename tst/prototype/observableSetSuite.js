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
        
        "test destroy event on element removes it from the set": function() {
            var element = new LIB_Subject();
            var set = new LIB_ObservableSet();
            set.add(element);
            jsUnity.assertIdentical(1, set.length, "the set should contain the element and so have length 1");
            jsUnity.assertIdentical(true, set.has(element), "the set should contain the element");
            element.dispatchEvent({type: 'LIB_destroy'});
            jsUnity.assertIdentical(0, set.length, "the set should not contain the element and so should have length 0");
            jsUnity.assertIdentical(false, set.has(element), "the set should not contain the element");
        }

    };

}());
