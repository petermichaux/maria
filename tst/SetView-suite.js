(function() {

    buster.testCase('SetView Suite', {

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
        },

        "test when model is set, previous child views are destroyed.": function() {
            var numbers = new maria.SetModel();
            var one = new maria.Model();
            var two = new maria.Model();
            numbers.add(one);
            numbers.add(two);
            var letters = new maria.SetModel();
            var alpha = new maria.Model();
            letters.add(alpha);

            var setView = new maria.SetView();
            setView.setModel(numbers);
            assert.same(2, setView.childNodes.length);
            var called1 = false;
            setView.firstChild.destroy = function() {
                called1 = true;
            };
            var called2 = false;
            setView.lastChild.destroy = function() {
                called2 = true;
            };

            // the next line should cause the child view destroy methods to be called
            setView.setModel(letters);
            assert.same(true, called1);
            assert.same(true, called2);
            assert.same(1, setView.childNodes.length, 'there should only be one child view at the end');
            assert.same(alpha, setView.firstChild.getModel(), 'the one child view should have the alpha model at the end')
        }

    });

}());
