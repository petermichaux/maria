(function () {

    buster.testCase('Controller Suite', {

        "test Controller has superConstructor Object": function () {
            assert.same(Object, maria.Controller.superConstructor);
        },

        "test model is undefined to start": function () {
            var c = new maria.Controller();
            assert.same(undefined, c.getModel());
        },

        "test getModel and setModel": function () {
            var c = new maria.Controller();
            var m = {};
            c.setModel(m);
            assert.same(m, c.getModel());
        },

        "test view is undefined to start": function () {
            var c = new maria.Controller();
            assert.same(undefined, c.getView());
        },

        "test getView and setView": function () {
            var c = new maria.Controller();
            var v = {};
            c.setView(v);
            assert.same(v, c.getView());
        },

        "test that destroying a controller does remove the controller from its view": function () {
            var v = new maria.View();
            var c = new maria.Controller();
            v.setController(c);
            assert.same(c, v.getController());
            c.destroy();
            refute.same(c, v.getController(), "the view has instantiated a new controller");
        },

        "test that destroying a ex-controller doesn't modify view": function () {
            var v = new maria.View();
            var c0 = new maria.Controller();
            var c1 = new maria.Controller();
            v.setController(c0);
            assert.same(c0, v.getController());
            v.setController(c1);
            assert.same(c1, v.getController());
            c0.destroy();
            assert.same(c1, v.getController());
        }

    });

}());
