(function() {

    buster.testCase('Controller.subclass Suite', {

        "test Controller.subclass is vanilla subclass": function() {
            assert.same(maria.subclass, maria.Controller.subclass);
        }

    });

}());
