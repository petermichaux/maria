(function () {

    buster.testCase('SetModel.subclass Suite', {

        "test subclass superConstructor": function () {
            var app = {};
            maria.SetModel.subclass(app, 'MySetModel');
            assert.same(maria.SetModel, app.MySetModel.superConstructor);
        },

        "test SetModel.subclass passes arguments through to Model.subclass": function () {
            var original = maria.Model.subclass;

            var namespace;
            var name;
            var options;

            // A plugin might redefine maria.Model.subclass so by redefining here
            // we also test that maria.SetModel.subclass uses late binding and
            // finds maria.Model.subclass when maria.SetModel.subclass is called rather
            // than when it is defined.
            maria.Model.subclass = function (a, b, c) {
                namespace = a;
                name = b;
                options = c;
                original.apply(this, arguments);
            };

            var expectedNamespace = {};
            var expectedName = "AlphaModel";
            var expectedOptions = {};

            maria.SetModel.subclass(expectedNamespace, expectedName, expectedOptions);

            assert.same(expectedNamespace, namespace, "namespace should be the one sent to SetModel.subclass");
            assert.same(expectedName, name, "name should be the one sent to SetModel.subclass");
            assert.same(expectedOptions, options, "options should be the one sent to SetModel.subclass");

            maria.Model.subclass = original;
        },

        "test elementConstructorName sugar": function () {
            var app = {};

            maria.Model.subclass(app, 'PersonModel');

            maria.SetModel.subclass(app, 'PeopleSetModel', {
                elementConstructorName: 'PersonModel'
            });

            assert.same(app.PersonModel, app.PeopleSetModel.prototype.getDefaultElementConstructor());
        },

        "test elementConstructor sugar": function () {
            var app = {};

            maria.Model.subclass(app, 'PersonModel');

            maria.SetModel.subclass(app, 'PeopleSetModel', {
                elementConstructor: app.PersonModel
            });

            assert.same(app.PersonModel, app.PeopleSetModel.prototype.getDefaultElementConstructor());
        },

        "test fromJSON class method": function () {
            var app = {};

            maria.Model.subclass(app, 'PersonModel', {
                attributes: {
                    name: {
                        type: 'string'
                    }
                }
            });

            maria.SetModel.subclass(app, 'PeopleSetModel', {
                elementConstructorName: 'PersonModel'
            });

            var people = app.PeopleSetModel.fromJSON([{name: 'Sgt Baker'}, {name: 'Mr Krinkle'}]);
            var result = people.toArray().sort(function (a, b) {
                return (a.getName() < b.getName()) ?
                           -1 :
                           (a.getName() > b.getName()) ?
                               1:
                               0;
            });
            assert.same(2, result.length);
            assert.same('Mr Krinkle', result[0].getName());
            assert.same('Sgt Baker', result[1].getName());
        }

    });

}());
