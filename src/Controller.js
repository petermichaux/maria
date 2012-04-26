var LIB_Controller = function() {};

LIB_Controller.prototype.destroy = function() {
    this._model = null;
    if (this._view) {
        this._view.setController(null);
        this._view = null;
    }
};

LIB_Controller.prototype.getModel = function() {
    return this._model;
};

LIB_Controller.prototype.setModel = function(model) {
    this._model = model;
};

LIB_Controller.prototype.getView = function() {
    return this._view;
};

LIB_Controller.prototype.setView = function(view) {
    this._view = view;
};
