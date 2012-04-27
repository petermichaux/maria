maria.LeafView = function() {
    maria.Leaf.call(this);
};

maria.Leaf.mixin(maria.LeafView.prototype);

// return the HTML template for this view
maria.LeafView.prototype.getTemplate = function() {
    return '<div/>';
};

// convert the HTML template to a DOM element
maria.LeafView.prototype.render = function() {
    return maria.parseHTML(this.getTemplate());
};

// render the template if it hasn't been and return the DOM element
maria.LeafView.prototype.getRootEl = function() {
    if (!this._rootEl) {
        this._rootEl = this.render();
    }
    return this._rootEl;
};

// update the root DOM element to represent the current model state
maria.LeafView.prototype.update = function() {
    // to be overridden by concrete view subclasses
};

maria.LeafView.prototype.destroy = function() {
    maria.purgeEventListener(this);
    this._model = null;
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    maria.Leaf.prototype.destroy.call(this);
};

maria.LeafView.prototype.getModel = function() {
    return this._model;
};

maria.LeafView.prototype.setModel = function(model) {
    this.setModelAndController(model, this._controller);
};

maria.LeafView.prototype.getController = function() {
    if (!this._controller) {
        this.setController(this.getDefaultController());
    }
    return this._controller;
};

maria.LeafView.prototype.getDefaultController = function() {
    var constructor = this.getDefaultControllerConstructor();
    return new constructor();
};

maria.LeafView.prototype.getDefaultControllerConstructor = function() {
    return maria.Controller;
};

maria.LeafView.prototype.setController = function(controller) {
    this.setModelAndController(this._model, controller);
};

maria.LeafView.prototype.setModelAndController = function(model, controller) {
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
