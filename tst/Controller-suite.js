(function() {

    buster.testCase('Controller Suite', {

        "test controllers call initialize method when created": function() {
            var originalInitialize = maria.Controller.prototype.initialize;

            maria.Controller.prototype.initialize = function() {
                this.iAmInitialized = true;
            };
            var c = new maria.Controller();
            assert.same(true, c.iAmInitialized);

            // clean up
            maria.Controller.prototype.initialize = originalInitialize;
        },

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
