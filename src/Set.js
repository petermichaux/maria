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

    // JavaScript's === operator has two problems: 
    //     1) It cannot distinguish between the two zeros.
    //            -0  === +0    // true
    //     2) NaN is not equal to itself.
    //            NaN === NaN   // false
    //
    function is(x, y) {
        return (x === y) ?
                   ((x !== 0) || ((1 / x) === (1 / y))) :
                   ((x !== x) && (y !== y));
    }

    function indexOfIdentical(elements, element) {
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            if (is(elements[i], element)) {
                return i;
            }
        }
        return -1;
    }

    function initSet(set) {
        set._elements = [];
        set.length = 0;
    }

/**

@property LIB_Set

@description

A constructor function for creating set objects.

var set = new LIB_Set();                         // an empty set

Sets have a length property that is the number of elements in the set.

var set = new LIB_Set('alpha', 'beta', 'alpha');
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

var set = new LIB_Set(1);
set.has(1); // true
set.has(2); // false

*/
    LIB_Set.prototype.has = function(element) {
        return indexOfIdentical(this._elements, element) >= 0;
    };

/**

@property LIB_Set.prototype.add

@parameter element

@description

If element is not already in the set then adds element to the set
and returns true. Otherwise returns false.

var set = new LIB_Set();
set.add(1); // true
set.has(1); // false

*/
    LIB_Set.prototype.add = function(element) {
        if (this.has(element)) {
            return false;
        }
        else {
            this._elements.push(element);
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

var set = new LIB_Set(1);
set['delete'](1); // true
set['delete'](1); // false

*/
    LIB_Set.prototype['delete'] = function(element) {
        var i = indexOfIdentical(this._elements, element);
        if (i < 0) {
            return false;
        }
        else {
            this._elements.splice(i, 1);
            this.length--;
            return true;
        }
    };

/**

@property LIB_Set.prototype.empty

@description

If the set has elements then removes all the elements and
returns true. Otherwise returns false.

var set = new LIB_Set(1);
set.empty(); // true
set.empty(); // false

*/
    LIB_Set.prototype.empty = function() {
        if (this._elements.length > 0) {
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
        return this._elements.slice(0);
    };

/**

@property LIB_Set.prototype.forEach

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set.

var set = new LIB_Set('alpha', 'beta', 'gamma');
set.forEach(function(element, set) {
    console.log(element);
});

*/
    LIB_Set.prototype.forEach = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var elements = this._elements;
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            callbackfn.call(thisArg, elements[i], this);
        }
    };

/**

@property LIB_Set.prototype.every

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns a truthy value
for all elements then every returns true. Otherwise returns false.

var set = new LIB_Set(1, 2, 3);
set.every(function(element, set) {
    return element < 2;
}); // false

*/
    LIB_Set.prototype.every = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var elements = this._elements;
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            if (!callbackfn.call(thisArg, elements[i], this)) {
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

var set = new LIB_Set(1, 2, 3);
set.some(function(element, set) {
    return element < 2;
}); // true

*/
    LIB_Set.prototype.some = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var elements = this._elements;
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            if (callbackfn.call(thisArg, elements[i], this)) {
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

var set = new LIB_Set(1, 2, 3);
set.reduce(function(accumulator, element) {
    return accumulator + element;
}); // 6
set.reduce(function(accumulator, element) {
    return accumulator + element;
}, 4); // 10

*/
    LIB_Set.prototype.reduce = function(callbackfn /*, initialValue */) {
        var elements = this._elements;
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
are added to a new set. This new set is the value returned by map.

var set = new LIB_Set('alpha', 'beta', 'gamma');
set.map(function(element) {
    return element.length;
}); // a set with elements 4 and 5

*/
    LIB_Set.prototype.map = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var result = new this.constructor();
        var elements = this._elements;
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            result.add(callbackfn.call(thisArg, elements[i], this));
        }
        return result;
    };

/**

@property LIB_Set.prototype.filter

@parameter callbackfn {function} The function to call for each element in the set.

@parameter thisArg {object} The optional object to use as the this object in calls to callbackfn.

@description

Calls callbackfn for each element of the set. If callbackfn returns true
for an element then that element is added to a new result set. This new result set
is the value returned by filter.

var set = new LIB_Set('alpha', 'beta', 'gamma');
set.map(function(element) {
    return element.length > 4;
}); // a set with elements 'alpha' and 'gamma'

*/
    LIB_Set.prototype.filter = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        var result = new this.constructor();
        var elements = this._elements;
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            var element = elements[i];
            if (callbackfn.call(thisArg, element, this)) {
                result.add(element);
            }
        }
        return result;
    };

}());
