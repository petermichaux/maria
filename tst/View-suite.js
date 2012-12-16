(function() {

    buster.testCase('View Suite', {

        "test calling constructor with parameters sets them in new instance": function() {
            var model = new maria.Model();
            var controller = new maria.Controller();
            var view = new maria.View(model, controller);
            assert.same(model, view.getModel(), 'model should be same');
            assert.same(controller, view.getController(), 'controller should be same');
        },

        "test calling constructor with only model parameter sets it and controller is default": function() {
            var model = new maria.Model();
            var view = new maria.View(model);
            assert.same(model, view.getModel(), 'model should be same');
            assert.same(maria.Controller, view.getController().constructor, 'controller should be default');
        },

        "test calling constructor with only controller parameter sets it and model is null": function() {
            var controller = new maria.Controller();
            var view = new maria.View(null, controller);
            assert.same(null, view.getModel(), 'model should be null by default');
            assert.same(controller, view.getController(), 'controller should be same');
        },

        "test default model actions change/update": function() {
            var view = new maria.View();
            var count = 0;
            var modelActions = view.getModelActions();
            for (var p in modelActions) {
                if (Object.prototype.hasOwnProperty.call(modelActions, p)) {
                    count++;
                }
            }
            assert.same(1, count, 'there should be one model actions by default');
            assert.same('update', modelActions.change);
        },
        
        "test when model actions are not empty then listeners are added": function() {
            var view = new maria.View();

            view.getModelActions = function() {
                return {
                    'squashed': 'onSquashed',
                    'squished': 'onSquished'
                };
            };

            var args = [];

            var originalOn = maria.on;
            maria.on = function(node, eventType, listener, methodName) {
                args.push({
                    node: node,
                    eventType: eventType,
                    listener: listener,
                    methodName: methodName
                });
            };

            // next line will trigger addition of listeners to model.
            var model = new maria.Model();
            view.setModel(model);

            assert.same(2, args.length, 'maria.on should have been called twice');

            // need a predictable order to test
            args.sort(function(a, b) {
                return a.methodName > b.methodName ?
                           1 :
                           a.methodName < b.methodName ?
                               -1 :
                               0;
            });

            assert.same(model, args[0].node);
            assert.same('squashed', args[0].eventType);
            assert.same(view, args[0].listener);
            assert.same('onSquashed', args[0].methodName);

            assert.same(model, args[1].node);
            assert.same('squished', args[1].eventType);
            assert.same(view, args[1].listener);
            assert.same('onSquished', args[1].methodName);

            maria.on = originalOn;
        },

        "test when model changed unsubscribe from previous model": function() {
            var view = new maria.View();
            
            view.getModelActions = function() {
                return {
                    'squashed': 'onSquashed',
                    'squished': 'onSquished'
                };
            };

            var args = [];

            var originalRemoveEventListener = maria.off;
            maria.off = function(node, eventType, listener, methodName) {
                args.push({
                    node: node,
                    eventType: eventType,
                    listener: listener,
                    methodName: methodName
                });
            };

            var model = new maria.Model();
            view.setModel(model);
            // change the model actions to test that the previous model actions are used when removing
            view.getModelActions = function() {
                return {'alpha': 'onAlpha'};
            };
            // next line will trigger removing of listeners from model.
            view.setModel(new maria.Model());

            assert.same(2, args.length, 'evento.addEventListener should have been called twice');

            // need a predictable order to test
            args.sort(function(a, b) {
                return a.methodName > b.methodName ?
                           1 :
                           a.methodName < b.methodName ?
                               -1 :
                               0;
            });

            assert.same(model, args[0].node);
            assert.same('squashed', args[0].eventType);
            assert.same(view, args[0].listener);
            assert.same('onSquashed', args[0].methodName);

            assert.same(model, args[1].node);
            assert.same('squished', args[1].eventType);
            assert.same(view, args[1].listener);
            assert.same('onSquished', args[1].methodName);

            maria.off = originalRemoveEventListener;
        },

        "test after destroy the model has no listeners": function() {
            var view = new maria.View();
            var model = new maria.Model();
            view.setModel(model);
            assert.same(1, model._evento_listeners.change.length);
            view.destroy();
            assert.same(0, model._evento_listeners.change.length);
        },

        "test destroy calls destroy on controller": function() {
            var controller = new maria.Controller();
            var view = new maria.View();
            view.setController(controller);
            var called = false;
            controller.destroy = function() {
                called = true;
            };
            view.destroy();
            assert.same(true, called);
        },

        "test destroy calls destroy on child views": function() {
            var view = new maria.View();

            var childView1 = new maria.View();
            var called1 = false;
            childView1.destroy = function() {
                called1 = true;
            };
            view.appendChild(childView1);

            var childView2 = new maria.View();
            var called2 = false;
            childView2.destroy = function() {
                called2 = true;
            };
            view.appendChild(childView2);

            view.destroy();

            assert.same(true, called1);
            assert.same(true, called2);
        },

        "test setting the model also sets the model in the controller": function() {
            var model = new maria.Model();
            var view = new maria.View();
            assert.same(undefined, view.getController().getModel());
            view.setModel(model);
            assert.same(model, view.getController().getModel());
        },

        "test the view sets itself as the view of the controller": function() {
            var controller = new maria.Controller();
            var view = new maria.View();
            assert.same(undefined, controller.getView());
            view.setController(controller);
            assert.same(view, controller.getView());
        }

    });

}());
