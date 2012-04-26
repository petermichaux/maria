// a component view for the composite design pattern 
// used in the view layer of MVC applications
//
maria.LeafView = function(model, controller, /*optional*/ doc) {
    hijos.Leaf.call(this);
    // this.setModel(model);
    // this.setController(controller);
    // this._doc = doc || document;
    // this.renderAndUpdate();
};

hijos.Leaf.mixin(maria.LeafView.prototype);

maria.LeafView.prototype.renderAndUpdate = function() {
    this.render();
    this.update();
};

maria.LeafView.prototype.tagName = 'div';
maria.LeafView.prototype.className = '';

maria.LeafView.prototype.createRootEl = function() {
    var rootEl = this._doc.createElement(this.tagName);
    rootEl.className = this.className;
    return rootEl;
};

maria.LeafView.prototype.getRootEl = function() {
    if (!this._rootEl) {
        this._rootEl = this.createRootEl();
    }
    return this._rootEl();
};

// build the HTML shell of the view that does not depend
// on the model state
maria.LeafView.prototype.render = function() {
    // to be overridden in concrete view subclasses
};

// update the HTML of the view to represent model state
maria.LeafView.prototype.handleChange = function() {
    // to be overridden by concrete view subclasses
};

maria.LeafView.prototype.destroy = function() {
    evento.purgeEventListener(this);
    this._model = null;
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    hijos.Leaf.prototype.destroy.call(this);
};

maria.LeafView.prototype.getModel = function() {
    return this._model;
};

maria.LeafView.prototype.setModel = function(model) {
    this.setModelAndController(model, this.getController());
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
    this.setModelAndController(this.getModel(), controller);
};

maria.LeafView.prototype.setModelAndController = function(model, controller) {
    if (this._model !== model) {
        if (this._model) {
            evento.removeEventListener(this._model, 'change', this, 'handleChange');
        }
        if (model) {
            evento.addEventListener(model, 'change', this, 'handleChange');
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
