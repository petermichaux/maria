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

hijos.mixinLeaf(LIB_View.prototype);

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
LIB_View.prototype.update = function() {
    // to be overridden by concrete view subclasses
};

LIB_View.prototype.destroy = function() {
    hijos.Leaf.prototype.destroy.call(this);
    this.setModel(null);
    this.setController(null);
    evento.purgeEventListener(this);
    delete this._doc;
    delete this._rootEl;
};

LIB_View.prototype.getModel = function() {
    return this._model;
};

LIB_View.prototype.setModel = function(model) {
    if (this._model) {
        evento.removeEventListener(this._model, 'change', this, 'update');
        delete this._model;
    }
    if (model) {
        evento.addEventListener(model, 'change', this, 'update');
        this._model = model;
        this.update();
    }
};

LIB_View.prototype.getController = function() {
    return this._controller;
};

LIB_View.prototype.setController = function(controller) {
    if (this._controller) {
        delete this._controller;
    }
    if (controller) {
        this._controller = controller;
    }
};
