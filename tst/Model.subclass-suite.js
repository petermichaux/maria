(function() {

    buster.testCase('Model.subclass Suite', {

        "test Model.subclass is vanilla subclass": function() {
            assert.same(maria.subclass, maria.Model.subclass);
        }

    });

}());
