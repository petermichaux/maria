// all children have the same model
// all children are attached to the same DOM node
maria.ContainerView = function() {
    maria.View.apply(this, arguments);
};

maria.ContainerView.prototype = new maria.View();
maria.ContainerView.prototype.constructor = maria.ContainerView;

maria.ContainerView.prototype.setModel = function(model) {
    maria.View.prototype.setModel.call(this, model);
    var children = this.childNodes;
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        children[i].setModel(model);
    }
};

maria.ContainerView.prototype.getRootEl = function() {
    if (!this._rootEl) {
        this._containerEl = this._rootEl = document.createElement('div');
        var children = this.childNodes;
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            this._containerEl.appendChild(children[i].getRootEl());
        }
    }
    return this._rootEl;
};

maria.ContainerView.prototype.insertBefore = function(newChild, oldChild) {
    maria.View.prototype.insertBefore.call(this, newChild, oldChild);
    newChild.setModel(this.getModel());
    if (this._rootEl) {
        this._containerEl.insertBefore(newChild.getRootEl(), oldChild ? oldChild.getRootEl() : null);
    }
};

maria.ContainerView.prototype.removeChild = function(oldChild) {
    maria.View.prototype.removeChild.call(this, oldChild);
    if (this._rootEl) {
        this._containerEl.removeChild(oldChild.getRootEl());
    }
};
