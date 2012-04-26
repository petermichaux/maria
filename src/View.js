// a composite view for the composite design pattern
// used in the view layer of MVC applications
//
maria.View = function() {
    maria.Node.call(this);
    maria.LeafView.apply(this, arguments);
};

maria.View.prototype = new maria.LeafView();
maria.View.prototype.constructor = maria.View;

maria.Node.mixin(maria.View.prototype);

maria.View.prototype.insertBefore = function(newChild, oldChild) {
    maria.Node.prototype.insertBefore.call(this, newChild, oldChild);
    this.getRootEl().insertBefore(newChild.getRootEl(), (oldChild ? oldChild.getRootEl() : null));
};

maria.View.prototype.removeChild = function(oldChild) {
    maria.Node.prototype.removeChild.call(this, oldChild);
    var oldChildRootEl = oldChild.getRootEl();
    oldChildRootEl.parentNode.removeChild(oldChildRootEl);
};

maria.View.prototype.destroy = function() {
    maria.LeafView.prototype.destroy.call(this);
    maria.Node.prototype.destroy.call(this);
};
