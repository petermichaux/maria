// a composite view for the composite design pattern
// used in the view layer of MVC applications
//
var LIB_CompositeView = function() {
    hijos.Node.call(this);
    LIB_View.apply(this, arguments);
};

LIB_CompositeView.prototype = LIB_create(LIB_View.prototype);
LIB_CompositeView.prototype.constructor = LIB_CompositeView;

hijos.mixinNode(LIB_CompositeView.prototype);

LIB_CompositeView.prototype.insertBefore = function(newChild, oldChild) {
    hijos.Node.prototype.insertBefore.call(this, newChild, oldChild);
    this.getRootEl().insertBefore(newChild.getRootEl(), (oldChild ? oldChild.getRootEl() : null));
};

LIB_CompositeView.prototype.removeChild = function(oldChild) {
    hijos.Node.prototype.removeChild.call(this, oldChild);
    var oldChildRootEl = oldChild.getRootEl();
    oldChildRootEl.parentNode.removeChild(oldChildRootEl);
};

LIB_CompositeView.prototype.destroy = function() {
    hijos.Node.prototype.destroy.call(this);
    LIB_View.prototype.destroy.call(this);
};
