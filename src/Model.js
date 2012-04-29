maria.Model = function() {
    maria.EventTarget.call(this);
};

maria.EventTarget.mixin(maria.Model.prototype);

maria.Model.prototype.destroy = function() {
    this.dispatchEvent({type: 'destroy'});
};
