(function() {

    buster.testCase('Model.subclass Suite', {

        "test subclass superConstructor": function() {
            var app = {};
            maria.Model.subclass(app, 'MyModel');
            assert.same(maria.Model, app.MyModel.superConstructor);
        },

        "test Model.subclass passes arguments through to maria.subclass": function() {
            var original = maria.subclass;

            var namespace;
            var name;
            var options;

            // A plugin might redefine maria.subclass so by redefining here
            // we also test that maria.Model.subclass uses late binding and
            // finds maria.subclass when maria.Model.subclass is called rather
            // than when it is defined.
            maria.subclass = function(a, b, c) {
                namespace = a;
                name = b;
                options = c;
                original.apply(this, arguments);
            };

            var expectedNamespace = {};
            var expectedName = "AlphaModel";
            var expectedOptions = {};

            maria.Model.subclass(expectedNamespace, expectedName, expectedOptions);

            assert.same(expectedNamespace, namespace, "namespace should be the one sent to Model.subclass");
            assert.same(expectedName, name, "name should be the one sent to Model.subclass");
            assert.same(expectedOptions, options, "options should be the one sent to Model.subclass");

            maria.subclass = original;
        },
        
        "test Model.subclass attributes": function() {
            var app = {};
            maria.Model.subclass(app, 'MyModel', {
                attributes: {
                    name: {
                        type: 'string',
                        'default': 'Lemmy'
                    },
                    accepted: {
                        type: 'boolean'
                    }
                }
            });
            
            var m = new app.MyModel();
            assert.isFunction(m.getName);
            assert.isFunction(m.guardName);
            assert.isFunction(m.setName);
            assert.isFunction(m.resetName);
            assert.isFunction(m.getAccepted);
            assert.isFunction(m.isAccepted);
            assert.isFunction(m.guardAccepted);
            assert.isFunction(m.setAccepted);
            assert.isFunction(m.toggleAccepted);
            assert.isFunction(m.resetAccepted);
        },

        "test Model.subclass attributes type required": function() {
            var app = {};
            
            assert.exception(function() {
                maria.Model.subclass(app, 'MyModel', {
                    attributes: {
                        name: {}
                    }
                });
            });
        },
        
        "test Model.subclass attributes do not overwrite properties": function() {
            var app = {};
            
            var guardName = function (v) {
                return '--' + v + '--';
            };
        
            maria.Model.subclass(app, 'MyModel', {
                attributes: {
                    name: {
                        type: 'string',
                        'default': 'Lemmy'
                    }
                },
                properties: {
                    guardName: guardName
                }
            });
            
            var m = new app.MyModel();
            assert.same(guardName, m.guardName);
            m.setName('Mud');
            assert.same('--Mud--', m.getName());
        },
        
        "test Model.subclass attribute method in attributes spec": function() {
            var app = {};
            
            var guardName = function (v) {
                return '--' + v + '--';
            };
        
            maria.Model.subclass(app, 'MyModel', {
                attributes: {
                    name: {
                        type: 'string',
                        'default': 'Lemmy',
                        guard: guardName
                    }
                }
            });
            
            var m = new app.MyModel();
            assert.same(guardName, m.guardName);
            assert.same('Lemmy', m.getName());
            m.setName('Mud');
            assert.same('--Mud--', m.getName());
        },
        
        "test Model.subclass adds fromJSON method to subclass": function() {
            var app = {};
        
            maria.Model.subclass(app, 'MyModel', {
                attributes: {
                    id: {
                        type: 'number'
                    },
                    name: {
                        type: 'string'
                    }
                }
            });

            assert.isFunction(app.MyModel.fromJSON);
            
            var m = app.MyModel.fromJSON({
                id: 123,
                name: 'Harold'
            });
            
            assert.same(123, m.getId());
            assert.same('Harold', m.getName());
        }

    });

}());
