(function() {

    buster.testCase('Model Suite', {

        "test models have EventTarget interface": function() {
            var m = new maria.Model();

            assert.isFunction(m.addEventListener, 'should have addEventListener');
            assert.isFunction(m.removeEventListener, 'should have removeEventListener');
            assert.isFunction(m.dispatchEvent, 'should have dispatchEvent');
            assert.isFunction(m.addParentEventTarget, 'should have addParentEventTarget');
            assert.isFunction(m.removeParentEventTarget, 'should have removeParentEventTarget');
        },

        "test models dispatch a destroy event when destroy method is called": function() {
            var m = new maria.Model();
            var called = false;
            m.addEventListener('destroy', function() {called = true;});
            m.destroy();
            assert.same(true, called);
        }

    });

}());
