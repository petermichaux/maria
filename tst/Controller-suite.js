(function() {

    buster.testCase('Controller Suite', {

        "test model is undefined to start": function() {
            var c = new maria.Controller();
            assert.same(undefined, c.getModel());
        },

        "test getModel and setModel": function() {
            var c = new maria.Controller();
            var m = {};
            c.setModel(m);
            assert.same(m, c.getModel());
        },

        "test view is undefined to start": function() {
            var c = new maria.Controller();
            assert.same(undefined, c.getView());
        },

        "test getView and setView": function() {
            var c = new maria.Controller();
            var v = {};
            c.setView(v);
            assert.same(v, c.getView());
        }

    });

}());
