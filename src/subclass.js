/**

When executing, `this` must be a constructor function.

Mix the "subclass" function into your constructor function.

@param {Object} namespace

@param {string} name

@param {Object} [options]

*/
maria.subclass = function (namespace, name, options) {
    options = options || {};
    var properties = options.properties;
    var SuperConstructor = this;
    var Constructor = namespace[name] =
        Object.prototype.hasOwnProperty.call(options, 'constructor') ?
            options.constructor :
            function () {
                SuperConstructor.apply(this, arguments);
            };
    Constructor.superConstructor = SuperConstructor;
    var prototype = Constructor.prototype = maria.create(SuperConstructor.prototype);
    prototype.constructor = Constructor;
    if (properties) {
        maria.borrow(prototype, properties);
    }
    Constructor.subclass = function () {
        SuperConstructor.subclass.apply(this, arguments);
    };
};
