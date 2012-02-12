var LIB_makeSet = function() {

    var elements = [];

    // This set implementation does not add a "LIB_id" property with
    // a unique value to each element and so the "has" method is O(n).
    //
    var has = function(element) {
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            if (element === elements[i]) {
                return true;
            }
        }
        return false;
    };

    var add = function(element) {
        if (!has(element)) {
            elements.push(element);
        }
    };

    // "delete" is a reserved word so it cannot be
    // the name of a variable.
    //
    var deletefn = function(element) {
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            if (element === elements[i]) {
                elements.splice(i, 1);
                return;
            }
        }
    };

    // initialize
    //
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        add(arguments[i]);
    }

    return {
        has: has,
        add: add,
        'delete': deletefn
    };

};


var LIB_mixinSet = function(obj) {
    var s = LIB_makeSet();
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) {
            obj[p] = s[p];
        }
    }
};


// function APP_Alphabet(name) {
//     var self = {
//         name: name
//     };
//     LIB_mixinSet(self);
//     return self;
// };
//
// var alphabet = new APP_Alphabet('Greek');
// alphabet.add('alpha');
// alphabet.add('zed');         // oops, that's not Greek
// alphabet['delete']('zed');
// alphabet.add('omega');
// alphabet.has('zed');        // false
// alphabet.has('omega');      // true
