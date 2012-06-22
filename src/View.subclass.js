/**

@property maria.View.subclass

@description

A function that makes subclassing maria.View more compact.

The following example creates a myapp.MyView constructor function
equivalent to the more verbose example shown in the documentation
for maria.View.

    maria.View.subclass(myapp, 'MyView', {
        modelActions: {
            'squashed': 'onSquashed',
            'squished': 'onSquished'
        },
        properties: {
            anotherMethod: function() {
                alert('another method');
            }
        }
    });

This subclassing function implements options following the
"convention over configuration" philosophy. The myapp.MyView will,
by convention, use the myapp.MyView and myapp.MyController
constructors. These can be configured.

    maria.View.subclass(myapp, 'MyView', {
        modelConstructor     : myapp.MyModel     ,
        controllerConstructor: myapp.MyController,
        modelActions: {
        ...

Alternately you can use late binding by supplying string names of
objects in the application's namespace object (i.e. the myapp object
in this example).

    maria.View.subclass(myapp, 'MyView', {
        modelConstructorName     : 'MyModel'     ,
        controllerConstructorName: 'MyController',
        modelActions: {
        ...

*/
maria.View.subclass = function(namespace, name, options) {
    options = options || {};
    var modelConstructor = options.modelConstructor;
    var modelConstructorName = options.modelConstructorName || name.replace(/(View|)$/, 'Model');
    var controllerConstructor = options.controllerConstructor;
    var controllerConstructorName = options.controllerConstructorName || name.replace(/(View|)$/, 'Controller');
    var modelActions = options.modelActions;
    var properties = options.properties || (option.properties = {});
    if (!Object.prototype.hasOwnProperty.call(properties, 'getDefaultControllerConstructor')) {
        properties.getDefaultControllerConstructor = function() {
            return controllerConstructor || namespace[controllerConstructorName];
        };
    }
    if (modelActions && !Object.prototype.hasOwnProperty.call(properties, 'getModelActions')) {
        properties.getModelActions = function() {
            return modelActions;
        };
    }
    if (!Object.prototype.hasOwnProperty.call(properties, 'initialize')) {
        properties.initialize = function() {
            if (!this.getModel()) {
                var mc = modelConstructor || namespace[modelConstructorName];
                this.setModel(new mc());
            }
        };
    }
    maria.subclass.call(this, namespace, name, options);
};
