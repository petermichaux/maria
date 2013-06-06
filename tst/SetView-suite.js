(function() {

    buster.testCase('SetView Suite', {

        "test SetView has superConstructor ElementView": function() {
            assert.same(maria.ElementView, maria.SetView.superConstructor);
        },

        "test when element added to set the view created by createChildView is appended to the set view": function() {
            var setView = new maria.SetView();
            var setModel = new maria.SetModel();
            setView.setModel(setModel);
            var model = new maria.Model();
            var childView = new maria.ElementView(model);
            setView.createChildView = function(model) {
                return childView;
            };
            setModel.add(model);
            assert.same(childView, setView.firstChild);
        },

        "test when element removed from set that child view is destroyed": function() {
            var setView = new maria.SetView();
            var setModel = new maria.SetModel();
            setView.setModel(setModel);
            assert.same(0, setView.childNodes.length, 'the set view should have no children to start');
            var model = new maria.Model();
            setModel.add(model);
            assert.same(1, setView.childNodes.length, 'the set view should have one child after adding a model to the set model');
            var childView = setView.firstChild;
            assert.same(model, childView.getModel(), 'the child view\'s model should be the model added to the set');
            var called = false;
            childView.destroy = function() {
                called = true;
            };
            // the next line should cause childView.destroy to be called
            setModel['delete'](model);
            assert.same(true, called, 'the model\'s destroy method should have been called');
            assert.same(0, setView.childNodes.length, 'the set view shouldn\'t have any childern at the end')
        }

    });

}());
