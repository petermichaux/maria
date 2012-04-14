// a composite view for the composite design pattern
// used in the view layer of MVC applications
//
var LIB_CompositeView = function() {
    LIB_View.apply(this, arguments);
};

LIB_CompositeView.prototype = LIB_create(LIB_View.prototype);
LIB_CompositeView.prototype.constructor = LIB_CompositeView;

LIB_mixinComposite(LIB_CompositeView.prototype);

LIB_CompositeView.prototype.appendChild = function(child) {
    LIB_Composite.prototype.appendChild.call(this, child);
    this.getRootEl().appendChild(child.getRootEl());
};

LIB_CompositeView.prototype.removeChild = function(child) {
    LIB_Composite.prototype.removeChild.call(this, child);
    var childRootEl = child.getRootEl();
    childRootEl.parentNode.removeChild(childRootEl);
};

LIB_CompositeView.prototype.destroy = function() {
    LIB_Composite.prototype.destroy.call(this);
    LIB_View.prototype.destroy.call(this);
};
