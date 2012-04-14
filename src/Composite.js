// an ordered composite for the composite design pattern
//
var LIB_Composite = function() {};

LIB_mixinComponent(LIB_Composite.prototype);

LIB_Composite.prototype.destroy = function() {
    if (this._LIB_children) { // TODO use hasOwnProperty here and in other checks below
        // copy in case one of the destroy methods modifies this._LIB_children
        var children = this._LIB_children.slice(0);
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            children[i].destroy();
            // release reference to child possibly to help garbage collection
            children[i] = null;
        }
    }
    LIB_Component.prototype.destroy.call(this);
};

// no complaints if already a child
//
LIB_Composite.prototype.appendChild = function(child) {
    if (!this._LIB_children) {
        this._LIB_children = [];
    }
    var children = this._LIB_children;
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        if (children[i] === child) {
            var parent = child.getParent();
            if (parent) {
                parent.removeChild(child);
            }
            break;
        }
    }
    // TRICKY must push child before setting parent
    // to avoid infinite mutual recursion.
    children.push(child);
    child.setParent(this);
};

LIB_Composite.prototype.removeChild = function(child) {
    if (this._LIB_children) {
        var children = this._LIB_children;
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            var c = children[i];
            if (c === child) {
                // TRICKY must remove child before setting parent to null
                // to avoid infinite mutual recursion.
                children.splice(i, 1);
                c.setParent(null);
                return; // can stop looking
            }
        }
    }
    throw new Error('LIB_Composite.prototype.removeChild: node not found.');
};

// TODO insertBefore and override in CompositeView

// TODO Perhaps have firstChild, nextSibling, etc methods like DOM instead of forEach, some, and every.

LIB_Composite.prototype.forEach = function() { // TODO "forEach" vs "forEachChild" vs "appendChild" vs "setParent"
    return Array.prototype.forEach.apply(this._LIB_children || [], arguments);
};

LIB_Composite.prototype.some = function() {
    return Array.prototype.some.apply(this._LIB_children || [], arguments);
};

LIB_Composite.prototype.every = function() {
    return Array.prototype.every.apply(this._LIB_children || [], arguments);
};

// TODO ? reduce, reduceRight, filter, map ?

var LIB_mixinComposite = function(obj) {
    for (var p in LIB_Composite.prototype) {
        if (Object.prototype.hasOwnProperty.call(LIB_Composite.prototype, p) &&
            (typeof LIB_Composite.prototype[p] === 'function')) {
            obj[p] = LIB_Composite.prototype[p];
        }
    }
};
