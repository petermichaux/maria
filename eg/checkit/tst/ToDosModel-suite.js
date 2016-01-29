(function () {

    buster.testCase('ToDosModel Suite', {

        "test isAllDone and isAllUndone": function () {
            var m = new checkit.TodosModel();
            var t1 = new checkit.TodoModel();
            m.add(t1);
            var t2 = new checkit.TodoModel();
            m.add(t2);

            assert.same(true, m.isAllUndone());
            assert.same(false, m.isAllDone());

            t1.setDone(true);
            assert.same(false, m.isAllUndone());
            assert.same(false, m.isAllDone());

            t2.setDone(true);
            assert.same(false, m.isAllUndone());
            assert.same(true, m.isAllDone());

            t1.setDone(false);
            assert.same(false, m.isAllUndone());
            assert.same(false, m.isAllDone());

            t2.setDone(false);
            assert.same(true, m.isAllUndone());
            assert.same(false, m.isAllDone());
        },

        "test markAllDone and markAllUndone": function () {
            var m = new checkit.TodosModel();
            var t1 = new checkit.TodoModel();
            m.add(t1);
            var t2 = new checkit.TodoModel();
            m.add(t2);

            m.markAllDone();
            assert.same(true, t1.isDone());
            assert.same(true, t2.isDone());

            m.markAllUndone();
            assert.same(false, t1.isDone());
            assert.same(false, t2.isDone());

        },

        "test deleteDone": function () {
            var m = new checkit.TodosModel();
            var t1 = new checkit.TodoModel();
            m.add(t1);
            var t2 = new checkit.TodoModel();
            m.add(t2);

            m.deleteDone();
            assert.same(true, m.has(t1));
            assert.same(true, m.has(t2));

            t1.toggleDone();
            m.deleteDone();
            assert.same(false, m.has(t1));
            assert.same(true, m.has(t2));

            t2.toggleDone();
            m.deleteDone();
            assert.same(false, m.has(t2));
        }

    });

}());
