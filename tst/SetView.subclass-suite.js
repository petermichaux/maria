(function () {

    buster.testCase('SetView.subclass Suite', {

        "test subclass superConstructor": function () {
            var app = {};
            maria.SetView.subclass(app, 'MySetView');
            assert.same(maria.SetView, app.MySetView.superConstructor);
        },

        "test SetView.subclass passes arguments through to ElementView.subclass": function () {
            var original = maria.ElementView.subclass;

            var namespace;
            var name;
            var options;

            // A plugin might redefine maria.ElmementView.subclass so by redefining here
            // we also test that maria.SetView.subclass uses late binding and
            // finds maria.ElementView.subclass when maria.SetView.subclass is called rather
            // than when it is defined.
            maria.ElementView.subclass = function (a, b, c) {
                namespace = a;
                name = b;
                options = c;
            };

            var expectedNamespace = {};
            var expectedName = "AlphaView";
            var expectedOptions = {};

            maria.SetView.subclass(expectedNamespace, expectedName, expectedOptions);

            assert.same(expectedNamespace, namespace, "namespace should be the one sent to SetView.subclass");
            assert.same(expectedName, name, "name should be the one sent to SetView.subclass");
            assert.same(expectedOptions, options, "options should be the one sent to SetView.subclass");

            maria.ElementView.subclass = original;
        }

    });

}());
