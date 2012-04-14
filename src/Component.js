// a parent-aware component for the composite design pattern
//
var LIB_Component = function() {};

LIB_Component.prototype.destroy = function() {
    // release reference to parent
    // possibly to help garbage collection
    this.setParent(null);
};

LIB_Component.prototype.getParent = function() {
    return this._parent;
};

// TODO this is expensive. Could change to _setParent and then don't need to call removeChild or appendChild
LIB_Component.prototype.setParent = function(p) {
    if (this._parent === p) {
        return;
    }
    if (this._parent) {
        // TRICKY: must delete parent before removing child
        // to avoid infinite mutual recursion.
        var parent = this._parent;
        delete this._parent;
        parent.removeChild(this);
    }
    if (p) {
        // TRICKY: must set parent before appending child
        // to avoid infinite mutual recursion.
        this._parent = p;
        p.appendChild(this);
    }
};

var LIB_mixinComponent = function(obj) {
    for (var p in LIB_Component.prototype) {
        if (Object.prototype.hasOwnProperty.call(LIB_Component.prototype, p) &&
            (typeof LIB_Component.prototype[p] === 'function')) {
            obj[p] = LIB_Component.prototype[p];
        }
    }
};
