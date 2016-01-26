(function () {

    buster.testCase('View.subclass Suite', {

        "test subclass superConstructor": function () {
            var app = {};
            maria.View.subclass(app, 'MyView');
            assert.same(maria.View, app.MyView.superConstructor);
        },

        "test getDefaultControllerConstructor property prefered over controllerConstructor and controllerConstructorName": function () {
            var app = {
                AlphaController: function () {
                    this.alpha = true;
                },
                BetaController: function () {
                    this.beta = true;
                },
                GammaController: function () {
                    this.gamma = true;
                }
            };
            maria.View.subclass(app, 'FooView', {
                controllerConstructor: app.BetaController,
                controllerConstructorName: 'GammaController',
                properties: {
                    getDefaultControllerConstructor: function () {
                        return app.AlphaController;
                    }
                }
            });
            assert.same(true, app.FooView.prototype.getDefaultController().alpha);
        },

        "test controllerConstructor prefered over controllerConstructorName": function () {
            var app = {
                BetaController: function () {
                    this.beta = true;
                },
                GammaController: function () {
                    this.gamma = true;
                }
            };
            maria.View.subclass(app, 'FooView', {
                controllerConstructor: app.BetaController,
                controllerConstructorName: 'GammaController'
            });
            assert.same(true, app.FooView.prototype.getDefaultController().beta);
        },

        "test controllerConstructorName used": function () {
            var app = {
                GammaController: function () {
                    this.gamma = true;
                }
            };
            maria.View.subclass(app, 'FooView', {
                controllerConstructorName: 'GammaController'
            });
            assert.same(true, app.FooView.prototype.getDefaultController().gamma);
        },

        "test convention for controller constructor name": function () {
            var app = {};
            maria.Controller.subclass(app, 'FooController', {
                constructor: function () {
                    maria.Controller.apply(this, arguments);
                    this.foo = true;
                }
            });
            maria.View.subclass(app, 'FooView');
            var view = new app.FooView();
            assert.same(true, view.getController().foo);
        },

        "test subclass model actions sugar": function () {
            var app = {};
            var modelActions = {};
            maria.View.subclass(app, 'AlphaView', {
                modelActions: modelActions
            });
            assert.same(modelActions, app.AlphaView.prototype.getModelActions());
        },

        "test getModelActions property prefered over modelActions": function () {
            var app = {};
            var modelActions0 = {};
            var modelActions1 = {};
            maria.View.subclass(app, 'AlphaView', {
                modelActions: modelActions1,
                properties: {
                    getModelActions: function () {
                        return modelActions0;
                    }
                }
            });
            assert.same(modelActions0, app.AlphaView.prototype.getModelActions());
        }

    });

}());
