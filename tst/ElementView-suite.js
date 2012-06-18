(function() {

    buster.testCase('ElementView Suite', {

        "test calling constructor with parameters sets them in new instance": function() {
            var model = new maria.Model();
            var controller = new maria.Controller();
            var doc = {};
            var elementView = new maria.ElementView(model, controller, doc);
            assert.same(model, elementView.getModel(), 'model should be same');
            assert.same(controller, elementView.getController(), 'controller should be same');
            assert.same(doc, elementView.getDocument(), 'document should be same');
        },

        "test calling constructor with only model parameter sets it and controller and document are defaults": function() {
            var model = new maria.Model();
            var elementView = new maria.ElementView(model);
            assert.same(model, elementView.getModel(), 'model should be same');
            assert.same(maria.Controller, elementView.getController().constructor, 'controller should be default');
            assert.same(document, elementView.getDocument(), 'document should be default');
        },

        "test calling constructor with only controller parameter sets it and model and document are defaults": function() {
            var controller = new maria.Controller();
            var elementView = new maria.ElementView(null, controller);
            assert.same(null, elementView.getModel(), 'model should be null by default');
            assert.same(controller, elementView.getController(), 'controller should be same');
            assert.same(document, elementView.getDocument(), 'document should be default');
        },

        "test calling constructor with only document parameter sets it and model and controller are defaults": function() {
            var doc = {};
            var elementView = new maria.ElementView(null, null, doc);
            assert.same(null, elementView.getModel(), 'model should be null default');
            assert.same(maria.Controller, elementView.getController().constructor, 'controller should be default');
            assert.same(doc, elementView.getDocument(), 'document should be same');
        }

    });

}());
