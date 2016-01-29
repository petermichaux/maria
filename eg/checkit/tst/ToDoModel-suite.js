(function () {

    buster.testCase('ToDoModel Suite', {

        "test newly created ToDoModel has expected state": function () {
            var m = new checkit.TodoModel();
            assert.same('', m.getContent());
            assert.same(false, m.isDone());
        },

        "test setters and getters": function () {
            var m = new checkit.TodoModel();

            m.setContent('         test drive Tesla         '); // verifying @trim
            m.setDone(true);

            assert.same('test drive Tesla', m.getContent());
            assert.same(true, m.isDone());
        },

        "test toggle method": function () {
            var m = new checkit.TodoModel();

            m.setDone(true);
            assert.same(true, m.isDone());
            m.toggleDone();
            assert.same(false, m.isDone());
        },

        "test event dispatching when setters called": function () {
            var m = new checkit.TodoModel();
            var called;
            var fakeView = {update: function (evt) {called = true;}};
            maria.on(m, 'change', fakeView, 'update');

            called = false;
            m.setDone(true);
            assert.same(true, called);

            called = false;
            m.setDone(false);
            assert.same(true, called);

            called = false;
            m.setDone(false);
            assert.same(false, called, 'no event should fire when setting already existing value');

            called = false;
            m.setContent("buy Tesla");
            assert.same(true, called);

            maria.off(m, 'change', fakeView, 'update');

            called = false;
            m.setDone(true);
            assert.same(false, called, 'fake view should no longer be observing events');

        },

        "test multiple views on same model": function () {
            var m = new checkit.TodoModel();

            var c1;
            var fv1 = {update: function (evt) {c1 = true;}};
            maria.on(m, 'change', fv1, 'update');

            var c2;
            var fv2 = {update: function (evt) {c2 = true;}};
            maria.on(m, 'change', fv2, 'update');

            var c3;
            var fv3 = {update: function (evt) {c3 = true;}};
            maria.on(m, 'change', fv3, 'update');

            c1 = false;
            c2 = false;
            c3 = false;
            m.setDone(true);
            assert.same(true, c1);
            assert.same(true, c2);
            assert.same(true, c3);

            c1 = false;
            c2 = false;
            c3 = false;
            m.setContent("buy Tesla");
            assert.same(true, c1);
            assert.same(true, c2);
            assert.same(true, c3);

            maria.off(m, 'change', fv1, 'update');
            maria.off(m, 'change', fv2, 'update');

            c1 = false;
            c2 = false;
            c3 = false;
            m.setDone(false);
            assert.same(false, c1, 'fake view should no longer be observing events');
            assert.same(false, c2, 'fake view should no longer be observing events');
            assert.same(true, c3, 'fake view should still be observing events');

        },

        "examine evt objects": function () {
            var m = new checkit.TodoModel();
            var savedEvent;
            var fakeView = {update: function (evt) {savedEvent = evt;}};
            maria.on(m, 'change', fakeView, 'update');

            m.setContent('Examine event');

            assert.same(savedEvent._propagationStopped, false);
            assert.same(savedEvent.currentTarget._content, 'Examine event');
            assert.same(savedEvent.currentTarget._evento_listeners.change.length, 1);

            var savedEvent2;
            var fakeView2 = {update: function (evt) {savedEvent2 = evt;}};
            maria.on(m, 'change', fakeView2, 'update'); // Add a second listener

            m.setContent('Examine event 2');

            assert.same(savedEvent2.currentTarget._content, 'Examine event 2');
            assert.same(savedEvent2.currentTarget._evento_listeners.change.length, 2); // Now there are two listeners
        }

    });

}());
