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
    if (!Object.prototype.hasOwnProperty.call(properties, 'getDefaultModelConstructor')) {
        properties.getDefaultModelConstructor = function() {
            return modelConstructor || namespace[modelConstructorName];
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
                this.setModel(this.getDefaultModel());
            }
        };
    }
    maria.subclass.call(this, namespace, name, options);
};
