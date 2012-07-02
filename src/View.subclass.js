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
by convention, use the myapp.MyController constructor.
This can be configured.

    maria.View.subclass(myapp, 'MyView', {
        controllerConstructor: myapp.MyController,
        modelActions: {
        ...

Alternately you can use late binding by supplying a string name of
an object in the application's namespace object (i.e. the myapp object
in this example).

    maria.View.subclass(myapp, 'MyView', {
        controllerConstructorName: 'MyController',
        modelActions: {
        ...

*/
maria.View.subclass = function(namespace, name, options) {
    options = options || {};
    var controllerConstructor = options.controllerConstructor;
    var controllerConstructorName = options.controllerConstructorName || name.replace(/(View|)$/, 'Controller');
    var modelActions = options.modelActions;
    var properties = options.properties || (options.properties = {});
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
    maria.subclass.call(this, namespace, name, options);
};
