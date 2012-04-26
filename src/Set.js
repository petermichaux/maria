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

var LIB_Set;

(function() {

    var nextId = 0;

    function getId() {
        return nextId++;
    }

    function initSet(set) {
        set._elements = {};
        set.length = 0;
    }

/**

@property LIB_Set

@description

A constructor function for creating set objects. Sets are designed
to hold JavaScript objects. They cache a marker on the objects.
Do not attempt to add primitives or host objects in a Set. This
is a compromise to make Set objects efficient for use in the model
layer of your application.

When using the set iterators (e.g. forEach, map) do not depend
on the order of iteration of the set's elements. Sets are unordered.

var set = new LIB_Set();                         // an empty set

Sets have a length property that is the number of elements in the set.

var alpha = {};
var beta = {};
var set = new LIB_Set(alpha, beta, alpha);
set.length; // 2

The methods of an event target object are inspired by the incomplete
Harmony Set proposal and the Array.prototype iterators.

*/
    LIB_Set = function() {
        initSet(this);
        for (var i = 0, ilen = arguments.length; i < ilen; i++) {
            this.add(arguments[i]);
        }
    };

/**

@property LIB_Set.prototype.has

@parameter element

@description

Returns true if element is in the set. Otherwise returns false.

var alpha = {};
var beta = {};
var set = new LIB_Set(alpha);
set.has(alpha); // true
set.has(beta); // false

*/
    LIB_Set.prototype.has = function(element) {
        return Object.prototype.hasOwnProperty.call(element, '_LIB_Set_id') &&
               Object.prototype.hasOwnProperty.call(this._elements, element._LIB_Set_id);
    };

/**

@property LIB_Set.prototype.add

@parameter element

@description

If element is not already in the set then adds element to the set
and returns true. Otherwise returns false.

var alpha = {};
var set = new LIB_Set();
set.add(alpha); // true
set.has(alpha); // false

*/
    LIB_Set.prototype.add = function(element) {
        if (this.has(element)) {
            return false;
        }
        else {
            var id;
            if (!Object.prototype.hasOwnProperty.call(element, '_LIB_Set_id')) {
                element._LIB_Set_id = getId();
            }
            this._elements[element._LIB_Set_id] = element;
            this.length++;
            return true;
        }
    };

/**

@property LIB_Set.prototype.delete

@parameter element

@description

If element is in the set then removes element from the set
and returns true. Otherwise returns false.

"delete" is a reserved word and older implementations
did not allow bare reserved words in property name
position so quote "delete".

var alpha = {};
var set = new LIB_Set(alpha);
set['delete'](alpha); // true
set['delete'](alpha); // false

*/
    LIB_Set.prototype['delete'] = function(element) {
        if (this.has(element)) {
            delete this._elements[element._LIB_Set_id];
            this.length--;
            return true;
        }
        else {
            return false;
        }
    };

/**

@property LIB_Set.prototype.empty

@description

If the set has elements then removes all the elements and
returns true. Otherwise returns false.

var alpha = {};
var set = new LIB_Set(alpha);
set.empty(); // true
set.empty(); // false

*/
    LIB_Set.prototype.empty = function() {
        if (this.length > 0) {
            initSet(this);
            return true;
        }
        else {
            return false;
        }
    };

/**

@property LIB_Set.prototype.toArray

@description

Returns the elements of the set in a new array.

*/
    LIB_Set.prototype.toArray = function() {
        var elements = [];
        for (var p in this._elements) {
            if (Object.prototype.hasOwnProperty.call(this._elements, p)) {
                elements.push(this._elements[p]);
            }
        }
        return elements;
    };

/**

@property LIB_Set.prototype.forEach

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set.

var alpha = {value: 0};
var beta = {value: 1};
var gamma = {value: 2};
var set = new LIB_Set(alpha, beta, gamma);
set.forEach(function(element, set) {
    console.log(element.value);
});

*/
    LIB_Set.prototype.forEach = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._elements) {
            if (Object.prototype.hasOwnProperty.call(this._elements, p)) {
                callbackfn.call(thisArg, this._elements[p], this);
            }
        }
    };

/**

@property LIB_Set.prototype.every

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns a truthy value
for all elements then every returns true. Otherwise returns false.

var one = {value: 1};
var two = {value: 2};
var three = {value: 3};
var set = new LIB_Set(one, two, three);
set.every(function(element, set) {
    return element.value < 2;
}); // false

*/
    LIB_Set.prototype.every = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._elements) {
            if (Object.prototype.hasOwnProperty.call(this._elements, p) &&
                !callbackfn.call(thisArg, this._elements[p], this)) {
                return false;
            }
        }
        return true;
    };

/**

@property LIB_Set.prototype.some

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns a truthy value
for at least one element then some returns true. Otherwise returns false.

var one = {value: 1};
var two = {value: 2};
var three = {value: 3};
var set = new LIB_Set(one, two, three);
set.some(function(element, set) {
    return element.value < 2;
}); // true

*/
    LIB_Set.prototype.some = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._elements) {
            if (Object.prototype.hasOwnProperty.call(this._elements, p) &&
                callbackfn.call(thisArg, this._elements[p], this)) {
                return true;
            }
        }
        return false;
    };

/**

@property LIB_Set.prototype.reduce

@parameter callbackfn {function} The function to call for each element in the set.

@parameter initialValue {object} The optional starting value for accumulation.

@description

Calls callbackfn for each element of the set.

For the first call to callbackfn, if initialValue is supplied then initalValue is
the first argument passed to callbackfn and the second argument is the first
element in the set to be iterated. Otherwise the first argument is
the first element to be iterated in the set and the second argument is
the next element to be iterated in the set.

For subsequent calls to callbackfn, the first argument is the value returned
by the last call to callbackfn. The second argument is the next value to be
iterated in the set.

var one = {value: 1};
var two = {value: 2};
var three = {value: 3};
var set = new LIB_Set(one, two, three);
set.reduce(function(accumulator, element) {
    return {value: accumulator.value + element.value};
}); // {value:6}
set.reduce(function(accumulator, element) {
    return accumulator + element.value;
}, 4); // 10

*/
    LIB_Set.prototype.reduce = function(callbackfn /*, initialValue */) {
        var elements = this.toArray();
        var i = 0;
        var ilen = elements.length;
        var accumulator;
        if (arguments.length > 1) {
            accumulator = arguments[1];
        }
        else if (ilen < 1) {
            throw new TypeError('reduce of empty set with no initial value');
        }
        else {
            i = 1;
            accumulator = elements[0];
        }
        while (i < ilen) {
            accumulator = callbackfn.call(undefined, accumulator, elements[i], this);
            i++;
        }
        return accumulator;
    };

/**

@property LIB_Set.prototype.map

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. The values returned by callbackfn
are added to a new array. This new array is the value returned by map.

var alpha = {length: 5};
var beta = {length: 4};
var gamma = {length: 5};
var set = new LIB_Set(alpha, beta, gamma);
set.map(function(element) {
    return element.length;
}); // [5,5,4] or [5,4,5] or [4,5,5]

*/
    LIB_Set.prototype.map = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var result = [];
        for (var p in this._elements) {
            if (Object.prototype.hasOwnProperty.call(this._elements, p)) {
                result.push(callbackfn.call(thisArg, this._elements[p], this));
            }
        }
        return result;
    };

/**

@property LIB_Set.prototype.filter

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns true
for an element then that element is added to a new array. This new array
is the value returned by filter.

var alpha = {length: 5};
var beta = {length: 4};
var gamma = {length: 5};
var set = new LIB_Set(alpha, beta, gamma);
set.filter(function(element) {
    return element.length > 4;
}); // [alpha, gamma] or [gamma, alpha]

*/
    LIB_Set.prototype.filter = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var result = [];
        for (var p in this._elements) {
            if (Object.prototype.hasOwnProperty.call(this._elements, p)) {
                var element = this._elements[p];
                if (callbackfn.call(thisArg, element, this)) {
                    result.push(element);
                }
            }
        }
        return result;
    };

}());

// insure prototype object is initialized properly
LIB_Set.call(LIB_Set.prototype);
