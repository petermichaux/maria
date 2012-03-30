var LIB_Set;

(function() {

    // utility to help wrapping Array.prototype methods
    //
    function forEach(arr, fn) {
        for (var i = 0, ilen = arr.length; i < ilen; i++) {
            fn(arr[i]);
        }
    }

    // http://wiki.ecmascript.org/doku.php?id=harmony:egal
    function is(x, y) {
        if (x === y) {
            // 0 === -0, but they are not identical
            return x !== 0 || 1 / x === 1 / y;
        }

        // NaN !== NaN, but they are identical.
        // NaNs are the only non-reflexive value, i.e., if x !== x,
        // then x is a NaN.
        // isNaN is broken: it converts its argument to number, so
        // isNaN("foo") => true
        return x !== x && y !== y;
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

    LIB_Set = function() {
        initSet(this);
        for (var i = 0, ilen = arguments.length; i < ilen; i++) {
            this.add(arguments[i]);
        }
    };

    // This set implementation does not add a "LIB_id" property with
    // a unique value to each element and so the "has" method is O(n).
    //
    LIB_Set.prototype.has = function(element) {
        return indexOfIdentical(this._elements, element) >= 0;
    };

    // If the element is in the set already then it is not added again.
    //
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

    // "delete" is a reserved word and older implementations
    // did not allow bare reserved words in property name
    // position so quote "delete".
    //
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

    LIB_Set.prototype.empty = function() {
        if (this._elements.length > 0) {
            initSet(this);
            return true;
        }
        else {
            return false;
        }
    };

    LIB_Set.prototype.toArray = function() {
        return this._elements.slice(0);
    };

    forEach(['forEach', 'every', 'some', 'reduce'],
        function(method) {
            // Match browser methods. If the browser has the methods
            // or the browser has been polyfilled then include
            // the newer methods on sets.
            if (typeof Array.prototype[method] === 'function') {
                LIB_Set.prototype[method] = function() {
                    return Array.prototype[method].apply(this._elements, arguments);
                };
            }
        });

    // map and filter return set objects
    //
    forEach(['map', 'filter'],
        function(method) {
            // Match browser methods. If the browser has the methods
            // or the browser has been polyfilled then include
            // the newer methods on sets.
            if (typeof Array.prototype[method] === 'function') {
                LIB_Set.prototype[method] = function() {
                    var arr = Array.prototype[method].apply(this._elements, arguments);
                    var result = new this.constructor();
                    for (var i=0, ilen=arr.length; i<ilen; i++) {
                        result.add(arr[i]);
                    }
                    return result;
                };
            }
        });

}());
