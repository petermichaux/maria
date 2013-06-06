/*
Hijos version 1.1.0
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hijos/blob/master/LICENSE
*/
/**

The root namespace for the Hijos library.

@namespace

*/
var hijos = {};
/**

A constructor function for creating `Leaf` objects to be used as part
of the composite design pattern.

    var leaf = new hijos.Leaf();

To attach a `Leaf` to a `Node`, use the `Node`'s child
manipulation methods: `appendChild`, `insertBefore`, `replaceChild`.
To remove a `Leaf` from a `Node` use the `Node`'s `removeChild` method.

@constructor

*/
hijos.Leaf = function() {
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

hijos.Leaf.superConstructor = Object;

/**

The parent `Node` of this object. Null if this object is not the child of
any `Node`.

@member hijos.Leaf.prototype.parentNode

@type {hijos.Leaf}

@readonly

*/

/**

The previous sibling `Leaf` of this object. Null if this object is not the child of
any `Node` or this object is the first child of a `Node`.

@member hijos.Leaf.prototype.previousSibling

@type {hijos.Leaf}

@readonly

*/

/**

The next sibling `Leaf` of this object. Null if this object is not the child of
any `Node` or this object is the last child of a `Node`.

@member hijos.Leaf.prototype.nextSibling

@type {hijos.Leaf}

@readonly

*/

/**

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
`Node` object unless this `Leaf` object is not contained by a `Node`.

*/
hijos.Leaf.prototype.destroy = function() {
    // Loosing references to relations may help garbage collection.
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

// insure prototype object is initialized properly
hijos.Leaf.call(hijos.Leaf.prototype);

/**

Mixes in the `Leaf` methods into any object. Be sure to call the `hijos.Leaf`
constructor to initialize the `Leaf`'s properties.

    app.MyView = function() {
        hijos.Leaf.call(this);
    };
    hijos.Leaf.mixin(app.MyView.prototype);

@param {Object} obj The object to become a `Leaf`.

*/
hijos.Leaf.mixin = function(obj) {
    obj.destroy = hijos.Leaf.prototype.destroy;
    hijos.Leaf.call(obj);
};
/**

A constructor function for creating `Node` objects with ordered children
to be used as part of the composite design pattern.

Do not mutate the elements of the `childNodes` array directly.
Instead use the `appendChild`, `insertBefore`, `replaceChild`, and `removeChild`
methods to manage the children.

    var node = new hijos.Node();

@constructor

@extends hijos.Leaf

*/
hijos.Node = function() {
    hijos.Leaf.call(this);
    this.childNodes = [];
    this.firstChild = null;
    this.lastChild = null;
};

hijos.Node.superConstructor = hijos.Leaf;

// Inherit from hijos.Leaf. Not all browsers have Object.create
// so write out the equivalent inline.
hijos.Node.prototype = (function() {
    function F() {}
    F.prototype = hijos.Leaf.prototype;
    return new F();
}());
hijos.Node.prototype.constructor = hijos.Node;

/**

The array of child objects.

@member hijos.Node.prototype.childNodes

@type {Array}

@readonly

*/

/**

The first child of this object. Null if this object has no children.

@member hijos.Node.prototype.firstChild

@type {hijos.Leaf}

@readonly

*/

/**

The last child of this object. Null if this object has no children.

@member hijos.Node.prototype.lastChild

@type {hijos.Leaf}

@readonly

*/


/**

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
`Node` object unless this object is not contained by another `Node`.

@override

*/
hijos.Node.prototype.destroy = function() {
    // copy in case one of the destroy methods modifies this.childNodes
    var children = this.childNodes.slice(0);
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        children[i].destroy();
    }
    hijos.Leaf.prototype.destroy.call(this);
    // Loosing references to relations may help garbage collection.
    this.childNodes = null;
    this.firstChild = null;
    this.lastChild = null;
};

/**

Does this `Node` have any children?

@return {boolean} `true` if this `Node` has children. Otherwise `false`.

*/
hijos.Node.prototype.hasChildNodes = function() {
    return this.childNodes.length > 0;
};

/**

Inserts `newChild` before `oldChild`. If `oldChild` is `null` then this is equivalent
to appending `newChild`. If `newChild` is a child of another `Node` then `newChild` is
removed from that other `Node` before appending to this `Node`.

    var parent = new hijos.Node();
    var child0 = new hijos.Leaf();
    parent.insertBefore(child0, null);
    var child1 = new hijos.Node();
    parent.insertBefore(child1, child0);

@param {Object} newChild The Leaf or Node object to insert.

@param {(Object|null)} [oldChild] The child object to insert before.

*/
hijos.Node.prototype.insertBefore = function(newChild, oldChild) {
    if (arguments.length < 2) {
        throw new Error('hijos.Node.prototype.insertBefore: not enough arguments.');
    }
    // Allow caller to be sloppy and send undefined instead of null.
    if (oldChild === undefined) {
        oldChild = null;
    }
    // Is newChild is already in correct position?
    if ((newChild === oldChild) || // inserting a node before itself
        (oldChild && (oldChild.previousSibling === newChild)) || // inserting newChild where it already is
        ((oldChild === null) && this.lastChild === newChild)) { // inserting child at end when it is already at the end
        return;
    }
    // do not allow the creation of a circular tree structure
    var node = this;
    while (node) {
        if (node === newChild) {
            throw new Error('hijos.Node.prototype.insertBefore: Node cannot be inserted at the specified point in the hierarchy.');
        }
        node = node.parentNode;
    }
    // remove from previous composite
    var parent = newChild.parentNode;
    if (parent) {
        parent.removeChild(newChild);
    }
    // continue with insertion
    var children = this.childNodes;
    // find index for newChild
    var indexForNewChild;
    if (oldChild === null) {
        // want to append to end of children
        indexForNewChild = children.length;
    }
    else {
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            if (children[i] === oldChild) {
                indexForNewChild = i;
                break;
            }
        }
        if (typeof indexForNewChild !== 'number') {
            throw new Error('hijos.Node.prototype.insertBefore: Node was not found.');
        }
    }
    // add to this composite
    children.splice(indexForNewChild, 0, newChild);
    this.firstChild = children[0];
    this.lastChild = children[children.length - 1];
    newChild.parentNode = this;
    var previousSibling = newChild.previousSibling = (children[indexForNewChild - 1] || null);
    if (previousSibling) {
        previousSibling.nextSibling = newChild;
    }
    var nextSibling = newChild.nextSibling = (children[indexForNewChild + 1] || null);
    if (nextSibling) {
        nextSibling.previousSibling = newChild;
    }
};

/**

Adds `newChild` as the last child of this `Node`. If `newChild` is a child of
another `Node` then `newChild` is removed from that other `Node` before appending
to this `Node`.

    var parent = new hijos.Node();
    var child = new hijos.Leaf();
    parent.appendChild(child);
    var child = new hijos.Node();
    parent.appendChild(child);

@param {Object} newChild The Leaf or Node object to append.

*/
hijos.Node.prototype.appendChild = function(newChild) {
    if (arguments.length < 1) {
        throw new Error('hijos.Node.prototype.appendChild: not enough arguments.');
    }
    this.insertBefore(newChild, null);
};

/**

Replaces `oldChild` with `newChild`. If `newChild` is a child of another `Node`
then `newChild` is removed from that other `Node` before appending to this `Node`.

    var parent = new hijos.Node();
    var child0 = new hijos.Leaf();
    parent.appendChild(child0);
    var child1 = new hijos.Node();
    parent.replaceChild(child1, child0);

@param {Object} newChild The Leaf or Node object to insert.

@param {Object} oldChild The child object to remove/replace.

*/
hijos.Node.prototype.replaceChild = function(newChild, oldChild) {
    if (arguments.length < 2) {
        throw new Error('hijos.Node.prototype.replaceChild: not enough arguments.');
    }
    if (!oldChild) {
        throw new Error('hijos.Node.prototype.replaceChild: oldChild must not be falsy.');
    }
    // child is already in correct position and
    // do not want removeChild to be called below
    if (newChild === oldChild) {
        return;
    }
    this.insertBefore(newChild, oldChild);
    this.removeChild(oldChild);
};

/**

Removes `oldChild`.

    var parent = new hijos.Node();
    var child = new hijos.Leaf();
    parent.appendChild(child);
    parent.removeChild(child);

@param {Object} oldChild The child object to remove.

*/
hijos.Node.prototype.removeChild = function(oldChild) {
    if (arguments.length < 1) {
        throw new Error('hijos.Node.prototype.removeChild: not enough arguments.');
    }
    var children = this.childNodes;
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        if (children[i] === oldChild) {
            var previousSibling = children[i - 1];
            if (previousSibling) {
                previousSibling.nextSibling = oldChild.nextSibling;
            }
            var nextSibling = children[i + 1];
            if (nextSibling) {
                nextSibling.previousSibling = oldChild.previousSibling;
            }
            oldChild.parentNode = null;
            oldChild.previousSibling = null;
            oldChild.nextSibling = null;
            children.splice(i, 1);
            this.firstChild = children[0] || null;
            this.lastChild = children[children.length - 1] || null;
            return; // stop looking
        }
    }
    throw new Error('hijos.Node.prototype.removeChild: node not found.');
};

// insure prototype object is initialized correctly
hijos.Node.call(hijos.Node.prototype);

/**

Mixes in the Node methods into any object.

Example 1

    app.MyView = function() {
        hijos.Node.call(this);
    };
    hijos.Node.mixin(app.MyView.prototype);

Example 2

    var obj = {};
    hijos.Node.mixin(obj);

@param {Object} obj The object to become a `Node`.

*/
hijos.Node.mixin = function(obj) {
    for (var p in hijos.Node.prototype) {
        if (Object.prototype.hasOwnProperty.call(hijos.Node.prototype, p) &&
            (typeof hijos.Node.prototype[p] === 'function')) {
            obj[p] = hijos.Node.prototype[p];
        }
    }
    hijos.Node.call(obj);
};
