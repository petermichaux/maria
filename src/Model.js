maria.Model = function() {
    maria.EventTarget.call(this);
    this.initialize();
};

maria.EventTarget.mixin(maria.Model.prototype);

maria.Model.prototype.initialize = function() {};

maria.Model.prototype.destroy = function() {
    this.dispatchEvent({type: 'destroy'});
};

maria.Model.subclass = function(namespace, name, options) {
    options = options || {};
    var SuperConstructor = options.SuperConstructor = options.SuperConstructor || maria.Model;
    maria.subclass(namespace, name, options);
};
