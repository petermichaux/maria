/*
Hormigas version 1.1.0
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hormigas/blob/master/LICENSE
*/
/**

The root namespace for the Hormigas library.

@namespace

*/
var hormigas = {};
(function() {

    var nextId = 0;

    function getId() {
        return nextId++;
    }

    function initSet(set) {
        set._hormigas_ObjectSet_elements = {};
        set.size = 0;
    }

/**

A constructor function for creating set objects. A set can only contain
a particular object once. That means all objects in a set are unique. This
is different from an array where one object can be in the array in
multiple positions.

`ObjectSet` objects are designed
to hold JavaScript objects. They cache a marker on the objects.
Do not attempt to add primitives or host objects in a `ObjectSet`. This
is a compromise to make `ObjectSet` objects efficient for use in the model
layer of your MVC-style application.

When using the set iterators (e.g. `forEach`) do not depend
on the order of iteration of the set's elements. `ObjectSet` objects are unordered.

    var set = new hormigas.ObjectSet();                     // an empty set

`ObjectSet` objects have a `size` property that is the number of elements in the set.

    var alpha = {};
    var beta = {};
    var set = new hormigas.ObjectSet(alpha, beta, alpha);
    set.size; // 2

The methods of an `ObjectSet` object are inspired by the incomplete
Harmony Set proposal and the `Array.prototype` iterators.

@constructor

@param {...Object} [item] An object to add to the set.

*/
    hormigas.ObjectSet = function() {
        initSet(this);
        for (var i = 0, ilen = arguments.length; i < ilen; i++) {
            this.add(arguments[i]);
        }
    };

    hormigas.ObjectSet.superConstructor = Object;

/**

The number of elements in the set.

@member hormigas.ObjectSet.prototype.size

@readonly

*/

/**

Is a particular object in the set or not?

    var alpha = {};
    var beta = {};
    var set = new hormigas.ObjectSet(alpha);
    set.has(alpha); // true
    set.has(beta); // false

@param {Object} element The item in question.

@return `true` if `element` is in the set. Otherwise `false`.

*/
    hormigas.ObjectSet.prototype.has = function(element) {
        return Object.prototype.hasOwnProperty.call(element, '_hormigas_ObjectSet_id') &&
               Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, element._hormigas_ObjectSet_id);
    };

/**

If `element` is not already in the set then adds element to the set.

    var alpha = {};
    var set = new hormigas.ObjectSet();
    set.add(alpha); // true
    set.has(alpha); // false

@param {Object} element The item to add to the set.

@return {boolean} `true` if `element` is added to the set as a result of this call. Otherwise `false` because `element` was already in the set.

*/
    hormigas.ObjectSet.prototype.add = function(element) {
        if (this.has(element)) {
            return false;
        }
        else {
            var id;
            if (!Object.prototype.hasOwnProperty.call(element, '_hormigas_ObjectSet_id')) {
                element._hormigas_ObjectSet_id = getId();
            }
            this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id] = element;
            this.size++;
            return true;
        }
    };

/**

If `element` is in the set then removes `element` from the set.

`delete` is a reserved word and older implementations
did not allow bare reserved words in property name
position so quote `delete`.

    var alpha = {};
    var set = new hormigas.ObjectSet(alpha);
    set['delete'](alpha); // true
    set['delete'](alpha); // false

@param {Object} element The item to delete from the set.

@return {boolean} `true` if `element` is deleted from the set as a result of this call. Otherwise `false` because `element` was not in the set.

*/
    hormigas.ObjectSet.prototype['delete'] = function(element) {
        if (this.has(element)) {
            delete this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id];
            this.size--;
            return true;
        }
        else {
            return false;
        }
    };

/**

If the set has elements then removes all the elements.

    var alpha = {};
    var set = new hormigas.ObjectSet(alpha);
    set.clear(); // true
    set.clear(); // false

@return {boolean} `true` if elements were deleted from the set as the result of this call. Otherwise `false` because no elements were in the set.

*/
    hormigas.ObjectSet.prototype.clear = function() {
        if (this.size > 0) {
            initSet(this);
            return true;
        }
        else {
            return false;
        }
    };

/**

Convert the set to an array.

@return {Array} The elements of the set in a new array.

*/
    hormigas.ObjectSet.prototype.toArray = function() {
        var elements = [];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                elements.push(this._hormigas_ObjectSet_elements[p]);
            }
        }
        return elements;
    };

/**

Calls `callbackfn` for each element of the set.

    var alpha = {value: 0};
    var beta = {value: 1};
    var gamma = {value: 2};
    var set = new hormigas.ObjectSet(alpha, beta, gamma);
    set.forEach(function(element) {
        console.log(element.value);
    });

@param {function} callbackfn The function to call for each element in the set.

@parameter {Object} [thisArg] The object to use as the `this` object in calls to `callbackfn`.

*/
    hormigas.ObjectSet.prototype.forEach = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p]);
            }
        }
    };

/**

Calls `callbackfn` for each element of the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new hormigas.ObjectSet(one, two, three);
    set.every(function(element) {
        return element.value < 2;
    }); // false

@param {function} callbackfn The function to call for each element in the set.

@param {Object} [thisArg] The object to use as the this object in calls to callbackfn.

@return {boolean} `true` if `callbackfn` returns a truthy value for all elements in the set. Otherwise `false`.

*/
    hormigas.ObjectSet.prototype.every = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p) &&
                !callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p])) {
                return false;
            }
        }
        return true;
    };

/**

Calls `callbackfn` for each element of the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new hormigas.ObjectSet(one, two, three);
    set.some(function(element) {
        return element.value < 2;
    }); // true

@param {function} callbackfn The function to call for each element in the set.

@param {Object} [thisArg] The object to use as the this object in calls to callbackfn.

@return {boolean} `true` if `callbackfn` returns a truthy value for at least one element in the set. Otherwise `false`.

*/
    hormigas.ObjectSet.prototype.some = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p) &&
                callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p])) {
                return true;
            }
        }
        return false;
    };

/**

Calls `callbackfn` for each element of the set.

For the first call to `callbackfn`, if `initialValue` is supplied then `initalValue` is
the first argument passed to `callbackfn` and the second argument is the first
element in the set to be iterated. Otherwise the first argument is
the first element to be iterated in the set and the second argument is
the next element to be iterated in the set.

For subsequent calls to `callbackfn`, the first argument is the value returned
by the last call to `callbackfn`. The second argument is the next value to be
iterated in the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new hormigas.ObjectSet(one, two, three);
    set.reduce(function(accumulator, element) {
        return {value: accumulator.value + element.value};
    }); // {value:6}
    set.reduce(function(accumulator, element) {
        return accumulator + element.value;
    }, 4); // 10

@param {function} callbackfn The function to call for each element in the set.

@param {*} initialValue The optional starting value for accumulation.

@return {*} The value returned by the final call to `callbackfn`.

*/
    hormigas.ObjectSet.prototype.reduce = function(callbackfn /*, initialValue */) {
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
            accumulator = callbackfn.call(undefined, accumulator, elements[i]);
            i++;
        }
        return accumulator;
    };

}());

// insure prototype object is initialized properly
hormigas.ObjectSet.call(hormigas.ObjectSet.prototype);

/**

Mixes in the `ObjectSet` methods into any object.

Example 1

    app.MyModel = function() {
        hormigas.ObjectSet.call(this);
    };
    hormigas.ObjectSet.mixin(app.MyModel.prototype);

Example 2

    var obj = {};
    hormigas.ObjectSet.mixin(obj);

@param {Object} obj The object to become an `ObjectSet`.

*/
hormigas.ObjectSet.mixin = function(obj) {
    for (var p in hormigas.ObjectSet.prototype) {
        if (Object.prototype.hasOwnProperty.call(hormigas.ObjectSet.prototype, p) &&
            (typeof hormigas.ObjectSet.prototype[p] === 'function')) {
            obj[p] = hormigas.ObjectSet.prototype[p];
        }
    }
    hormigas.ObjectSet.call(obj);
};
