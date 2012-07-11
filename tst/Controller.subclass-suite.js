(function() {

    buster.testCase('Controller.subclass Suite', {

        "test Controller.subclass passes arguments through to maria.subclass": function() {
            var original = maria.subclass;

            var namespace;
            var name;
            var options;

            // A plugin might redefine maria.subclass so by redefining here
            // we also test that maria.Controller.subclass uses late binding and
            // finds maria.subclass when maria.Controller.subclass is called rather
            // than when it is defined.
            maria.subclass = function(a, b, c) {
                namespace = a;
                name = b;
                options = c;
            };

            var expectedNamespace = {};
            var expectedName = "AlphaController";
            var expectedOptions = {};

            maria.Controller.subclass(expectedNamespace, expectedName, expectedOptions);

            assert.same(expectedNamespace, namespace, "namespace should be the one sent to Controller.subclass");
            assert.same(expectedName, name, "name should be the one sent to Controller.subclass");
            assert.same(expectedOptions, options, "options should be the one sent to Controller.subclass");

            maria.subclass = original;
        }

    });

}());
