// A prototypical set object cunningly written to enable easy mixins.
//
var LIB_set = {

    // This set implementation does not add a "LIB_id" property with
    // a unique value to each element and so the "has" method is O(n).
    //
    has: function(element) {
        if (Object.prototype.hasOwnProperty.call(this, '_elements')) {
            for (var i = 0, ilen = this._elements.length; i < ilen; i++) {
                if (element === this._elements[i]) {
                    return true;
                }
            }
        }
        return false;
    },

    add: function(element) {
        if (!this.has(element)) {
            Object.prototype.hasOwnProperty.call(this, '_elements') || (this._elements = []);
            this._elements.push(element);
        }
    },

    // "delete" is a reserved word and older implementations
    // did not allow bare reserved words in property name
    // position so quote "delete".
    //
    "delete": function(element) {
        if (Object.prototype.hasOwnProperty.call(this, '_elements')) {
            for (var i = 0, ilen = this._elements.length; i < ilen; i++) {
                if (element === this._elements[i]) {
                    this._elements.splice(i, 1);
                    return;
                }
            }
        }
    }

};


var LIB_Set = function() {
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        this.add(arguments[i]);
    }
    // The constructor property is unreliable in general
    // but in case someone is depending on it we repair it.
    this.constructor = LIB_Set;
};
LIB_Set.prototype = LIB_set;


var LIB_mixinSet = function(obj) {
    for (var p in LIB_set) {
        if (Object.prototype.hasOwnProperty.call(LIB_set, p) &&
            // Don't want to copy LIB_set._elements array.
            (typeof LIB_set[p] === 'function')) {
            obj[p] = LIB_set[p];
        }
    }
};


// function APP_Alphabet(name) {
//     this.name = name;
// };
// LIB_mixinSet(APP_Alphabet.prototype);
// 
// var alphabet = new APP_Alphabet('Greek');
// alphabet.add('alpha');
// alphabet.add('zed');         // oops, that's not Greek
// alphabet['delete']('zed');
// alphabet.add('omega');
// alphabet.has('zed');        // false
// alphabet.has('omega');      // true
