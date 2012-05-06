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
    var methods = options.methods || (options.methods = {});
    var members = options.members;
    if (members && !methods.initialize) {
        methods.initialize = function() {
            SuperConstructor.prototype.initialize.apply(this, arguments);
            for (var p in members) {
                if (Object.prototype.hasOwnProperty.call(members, p)) {
                    this[p] = members[p];
                }
            }
        };
    }
    maria.subclass(namespace, name, options);
};
