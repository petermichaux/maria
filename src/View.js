// a component view for the composite design pattern 
// used in the view layer of MVC applications
//
var LIB_View = function(model, controller, /*optional*/ doc) {
    hijos.Leaf.call(this);
    this.setModel(model);
    this.setController(controller);
    this._doc = doc || document;
    this.renderAndUpdate();
};

hijos.Leaf.mixin(LIB_View.prototype);

LIB_View.prototype.renderAndUpdate = function() {
    this.render();
    this.update();
};

LIB_View.prototype.tagName = 'div';
LIB_View.prototype.className = '';

LIB_View.prototype.createRootEl = function() {
    var rootEl = this._doc.createElement(this.tagName);
    rootEl.className = this.className;
    return rootEl;
};

LIB_View.prototype.getRootEl = function() {
    if (!this._rootEl) {
        this._rootEl = this.createRootEl();
    }
    return this._rootEl();
};

// build the HTML shell of the view that does not depend
// on the model state
LIB_View.prototype.render = function() {
    // to be overridden in concrete view subclasses
};

// update the HTML of the view to represent model state
LIB_View.prototype.handleChange = function() {
    // to be overridden by concrete view subclasses
};

LIB_View.prototype.destroy = function() {
    evento.purgeEventListener(this);
    this._model = null;
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    hijos.Leaf.prototype.destroy.call(this);
};

LIB_View.prototype.getModel = function() {
    return this._model;
};

LIB_View.prototype.setModel = function(model) {
    this.setModelAndController(model, this.getController());
};

LIB_View.prototype.getController = function() {
    if (!this._controller) {
        this.setController(this.getDefaultController());
    }
    return this._controller;
};

LIB_View.prototype.getDefaultController = function() {
    var constructor = this.getDefaultControllerConstructor();
    return new constructor();
};

LIB_View.prototype.getDefaultControllerConstructor = function() {
    return LIB_Controller;
};

LIB_View.prototype.setController = function(controller) {
    this.setModelAndController(this.getModel(), controller);
};

LIB_View.prototype.setModelAndController = function(model, controller) {
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
