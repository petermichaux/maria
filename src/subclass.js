// "this" must be a constructor function
// mix the "subclass" function into your constructor function
//
maria.subclass = function(namespace, name, options) {
    options = options || {};
    var properties = options.properties;
    var SuperConstructor = this;
    var Constructor = namespace[name] =
        Object.prototype.hasOwnProperty.call(options, 'constructor') ?
            options.constructor :
            function() {
                SuperConstructor.apply(this, arguments);
            };
    var prototype = Constructor.prototype = maria.create(SuperConstructor.prototype);
    prototype.constructor = Constructor;
    if (properties) {
        maria.borrow(prototype, properties);
    }
    Constructor.subclass = function() {
        SuperConstructor.subclass.apply(this, arguments);
    };
};
