// all children are attached to the same DOM node
maria.ElementView = function() {
    maria.View.apply(this, arguments);
};

maria.ElementView.prototype = new maria.View();
maria.ElementView.prototype.constructor = maria.ElementView;

maria.ElementView.prototype.getRootEl = function() {
    if (!this._rootEl) {
        this._containerEl = this._rootEl = document.createElement('div');
        var childViews = this.childNodes;
        for (var i = 0, ilen = childViews.length; i < ilen; i++) {
            this._containerEl.appendChild(childViews[i].getRootEl());
        }
    }
    return this._rootEl;
};

maria.ElementView.prototype.insertBefore = function(newChild, oldChild) {
    maria.View.prototype.insertBefore.call(this, newChild, oldChild);
    if (this._rootEl) {
        this._containerEl.insertBefore(newChild.getRootEl(), oldChild ? oldChild.getRootEl() : null);
    }
};

maria.ElementView.prototype.removeChild = function(oldChild) {
    maria.View.prototype.removeChild.call(this, oldChild);
    if (this._rootEl) {
        this._containerEl.removeChild(oldChild.getRootEl());
    }
};
