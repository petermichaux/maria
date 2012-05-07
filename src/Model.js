maria.Model = function() {
    maria.EventTarget.call(this);
    this.initialize();
};

maria.EventTarget.mixin(maria.Model.prototype);

maria.Model.prototype.initialize = function() {};

maria.Model.prototype.destroy = function() {
    this.dispatchEvent({type: 'destroy'});
};
