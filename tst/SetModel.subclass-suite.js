(function() {

    buster.testCase('SetModel.subclass Suite', {

        "test SetModel.subclass passes arguments through to Model.subclass": function() {
            var original = maria.Model.subclass;

            var namespace;
            var name;
            var options;

            // A plugin might redefine maria.Model.subclass so by redefining here
            // we also test that maria.SetModel.subclass uses late binding and
            // finds maria.Model.subclass when maria.SetModel.subclass is called rather
            // than when it is defined.
            maria.Model.subclass = function(a, b, c) {
                namespace = a;
                name = b;
                options = c;
            };

            var expectedNamespace = {};
            var expectedName = "AlphaModel";
            var expectedOptions = {};

            maria.SetModel.subclass(expectedNamespace, expectedName, expectedOptions);

            assert.same(expectedNamespace, namespace, "namespace should be the one sent to SetModel.subclass");
            assert.same(expectedName, name, "name should be the one sent to SetModel.subclass");
            assert.same(expectedOptions, options, "options should be the one sent to SetModel.subclass");

            maria.Model.subclass = original;
        }

    });

}());
