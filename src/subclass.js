(function() {

    function F() {};

    maria.subclass = function(namespace, name, options) {
        options = options || {};
        var members = options.members;
        var methods = options.methods;
        // the "maria" object is the top of the chain and not a function
        var SuperConstructor = (typeof this === 'function') ? this : F;
        var Constructor = namespace[name] = function() {
            SuperConstructor.apply(this, arguments);
        };
        var prototype = Constructor.prototype = new SuperConstructor();
        prototype.constructor = Constructor;
        if (members) {
            maria.borrow(prototype, members);
        }
        if (methods) {
            maria.borrow(prototype, methods);
        }
        Constructor.subclass = function() {
            SuperConstructor.subclass.apply(this, arguments);
        };
    };

}());
