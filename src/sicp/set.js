var LIB_makeSet = function() {

    var self = {length: 0};
    var elements = [];

    // This set implementation does not add a "LIB_id" property with
    // a unique value to each element and so the "has" method is O(n).
    //
    var has = self.has = function(element) {
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            if (element === elements[i]) {
                return true;
            }
        }
        return false;
    };

    var add = self.add = function(element) {
        if (has(element)) {
            return false;
        }
        else {
            elements.push(element);
            self.length++;
            return true;
        }
    };

    // "delete" is a reserved word so it cannot be
    // the name of a variable.
    //
    var deletefn = self['delete'] = function(element) {
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            if (element === elements[i]) {
                elements.splice(i, 1);
                self.length--;
                return true;
            }
        }
        return false;
    };

    self.toArray = function() {
        return elements.slice(0);
    };

    // initialize
    //
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        add(arguments[i]);
    }

    return self;

};
