maria.View = function(model, controller) {
    maria.Node.call(this);
    this.setModel(model);
    this.setController(controller);
    this.initialize();
};

maria.Node.mixin(maria.View.prototype);

maria.View.prototype.initialize = function() {};

maria.View.prototype.destroy = function() {
    maria.purgeEventListener(this);
    this._model = null;
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    maria.Node.prototype.destroy.call(this);
};

maria.View.prototype.update = function() {
    // to be overridden by concrete view subclasses
};

maria.View.prototype.getModel = function() {
    return this._model;
};

maria.View.prototype.setModel = function(model) {
    this.setModelAndController(model, this._controller);
};

maria.View.prototype.getDefaultControllerConstructor = function() {
    return maria.Controller;
};

maria.View.prototype.getDefaultController = function() {
    var constructor = this.getDefaultControllerConstructor();
    return new constructor();
};

maria.View.prototype.getController = function() {
    if (!this._controller) {
        this.setController(this.getDefaultController());
    }
    return this._controller;
};

maria.View.prototype.setController = function(controller) {
    this.setModelAndController(this._model, controller);
};

maria.View.prototype.getModelActions = function() {
    return {'change': 'update'};
};

maria.View.prototype.setModelAndController = function(model, controller) {
    var type, eventMap;
    if (this._model !== model) {
        if (this._model) {
            eventMap = this._lastModelActions;
            for (type in eventMap) {
                if (Object.prototype.hasOwnProperty.call(eventMap, type)) {
                    maria.removeEventListener(this._model, type, this, eventMap[type]);
                }
            }
            delete this._lastModelActions;
        }
        if (model) {
            eventMap = this._lastModelActions = this.getModelActions() || {};
            for (type in eventMap) {
                if (Object.prototype.hasOwnProperty.call(eventMap, type)) {
                    maria.addEventListener(model, type, this, eventMap[type]);
                }
            }
        }
        this._model = model;
    }
    if (controller) {
        controller.setView(this);
        controller.setModel(model);
    }
    this._controller = controller;
};


maria.View.declareConstructor = function(namespace, name, options) {
    options = options || {};
    var modelConstructor = options.modelConstructor;
    var modelConstructorName = options.modelConstructorName || name.replace(/(View|)$/, 'Model');
    var controllerConstructor = options.controllerConstructor;
    var controllerConstructorName = options.controllerConstructorName || name.replace(/(View|)$/, 'Controller');
    var modelActions = options.modelActions;
    var methods = options.methods;
    var superConstructor = options.superConstructor || maria.View;
    var Constructor = namespace[name] = function(model, controller, doc) {
        var mc = modelConstructor || namespace[modelConstructorName];
        superConstructor.call(this, (model || new mc()), controller, doc);
    };
    var prototype = Constructor.prototype = new superConstructor();
    prototype.constructor = Constructor;
    prototype.getDefaultControllerConstructor = function() {
        return controllerConstructor || namespace[controllerConstructorName];
    };
    if (modelActions) {
        prototype.getModelActions = function() {
            return modelActions;
        };
    }
    // Add caller-supplied methods last so they overwrite any
    // of the automatically created methods defined above.
    if (methods) {
        maria.borrow(prototype, methods);
    }
};
