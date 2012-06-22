(function() {

    buster.testCase('SetView.subclass Suite', {

        "test SetView.subclass is the same as ElementView.subclass": function() {
            assert.same(maria.ElementView.subclass, maria.SetView.subclass);
        }

    });

}());
