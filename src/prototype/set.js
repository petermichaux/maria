var LIB_Set = function() {
    this._elements = [];
    this.length = 0;
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        this.add(arguments[i]);
    }
};

// This set implementation does not add a "LIB_id" property with
// a unique value to each element and so the "has" method is O(n).
//
LIB_Set.prototype.has = function(element) {
    for (var i = 0, ilen = this._elements.length; i < ilen; i++) {
        if (element === this._elements[i]) {
            return true;
        }
    }
    return false;
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
    for (var i = 0, ilen = this._elements.length; i < ilen; i++) {
        if (element === this._elements[i]) {
            this._elements.splice(i, 1);
            this.length--;
            return true;
        }
    }
    return false;
};

LIB_Set.prototype.toArray = function() {
    return this._elements.slice(0);
};

(function() {

    // utility to help wrapping Array.prototype methods
    //
    function forEach(arr, fn) {
        for (var i = 0, ilen = arr.length; i < ilen; i++) {
            fn(arr[i]);
        }
    }

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
