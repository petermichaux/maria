(function() {

    function F() {};

    maria.subclass = function(namespace, name, options) {
        options = options || {};
        var members = options.members;
        var methods = options.methods;
        var SuperConstructor = options.SuperConstructor || F;
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
        Constructor.subclass = function(namespace, name, options) {
            options = options || {};
            options.SuperConstructor = options.SuperConstructor || Constructor;
            SuperConstructor.subclass(namespace, name, options);
        };
    };

}());
