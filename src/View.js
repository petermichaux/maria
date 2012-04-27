maria.View = function(model, controller) {
    maria.Node.call(this);
    this.setModelAndController(model, controller);
};

maria.Node.mixin(maria.View.prototype);

maria.View.prototype.destroy = function() {
    maria.purgeEventListener(this);
    this._model = null;
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    maria.Node.prototype.destroy.call(this);
};

maria.View.prototype.displayView = function() {
    // to be overridden by concrete view subclasses
};

maria.View.prototype.displayChildViews = function() {
    var node = this.firstChild;
    while (node) {
        node.display();
        node = node.nextSibling;
    }
};

maria.View.prototype.display = function() {
    this.displayView();
    this.displayChildViews();
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

maria.View.prototype.setModelAndController = function(model, controller) {
    if (this._model !== model) {
        if (this._model) {
            maria.removeEventListener(this._model, 'change', this, 'update');
        }
        if (model) {
            maria.addEventListener(model, 'change', this, 'update');
        }
        this._model = model;
    }
    if (this._controller !== controller) {
        if (controller) {
            controller.setView(this);
            controller.setModel(model);
        }
        this._controller = controller;
    }
};
