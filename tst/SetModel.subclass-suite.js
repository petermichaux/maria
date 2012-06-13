(function() {

    buster.testCase('SetModel.subclass Suite', {

        "test SetModel.subclass is vanilla subclass": function() {
            assert.same(maria.subclass, maria.SetModel.subclass);
        }

    });

}());
