/*
 * Copyright (c) 2012, Peter Michaux, http://peter.michaux.ca/
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

/**

@property hijos.Leaf

@description

A constructor function for creating Leaf objects to be used as part
of the composite design pattern.

Leaf objects have three read-only properties describing the Leaf object's
relationships to other Leaf and Node objects participating in
the composite pattern.

    1. parentNode
    2. previousSibling
    3. nextSibling

These properties will be null when the Leaf is not a child
of a Node object. To attach a Leaf to a Node, use the Node's child
manipulation methods: appendChild, insertBefore, replaceChild.
To remove a Leaf from a Node use the Node's removeChild method.

var leaf = new hijos.Leaf();

*/
hijos.Leaf = function() {
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

/**

@property hijos.Leaf.prototype.destroy

@description

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
Node object unless this Leaf object is not contained by a Node.

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

@property hijos.Leaf.mixin

@parameter obj {object} The object to become a Leaf.

@description

Mixes in the Leaf methods into any object. Be sure to call the hijos.Leaf
constructor to initialize the Leaf's properties.

app.MyView = function() {
    hijos.Leaf.call(this);
};
hijos.Leaf.mixin(app.MyView.prototype);

*/
hijos.Leaf.mixin = function(obj) {
    obj.destroy = hijos.Leaf.prototype.destroy;
    hijos.Leaf.call(obj);
};
