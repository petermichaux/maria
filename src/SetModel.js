// maria.SetModel inherits from maria.Set.
//
maria.SetModel = function() {
    maria.Set.apply(this, arguments);
    maria.Model.call(this);
};

maria.SetModel.prototype = new maria.Model();
maria.SetModel.prototype.constructor = maria.SetModel;

maria.Set.mixin(maria.SetModel.prototype);

// Wrap the set mutator methods to dispatch events.

// takes multiple arguments so that only one event will be fired
//
maria.SetModel.prototype.add = function() {
    var added = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (maria.Set.prototype.add.call(this, argument)) {
            added.push(argument);
            if ((typeof argument.addEventListener === 'function') &&
                (typeof argument.removeEventListener === 'function')) {
                argument.addEventListener('destroy', this);    
            }
            if ((typeof argument.addParentEventTarget === 'function') &&
                // want to know can remove later
                (typeof argument.removeParentEventTarget === 'function')) {
                argument.addParentEventTarget(this);
            }
        }
    }
    var modified = added.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'add', relatedTargets: added, bubbles: false});
        this.dispatchEvent({type: 'afterAdd', relatedTargets: added});
    }
    return modified;
};

// takes multiple arguments so that only one event will be fired
//
maria.SetModel.prototype['delete'] = function() {
    var deleted = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (maria.Set.prototype['delete'].call(this, argument)) {
            deleted.push(argument);
            if (typeof argument.removeEventListener === 'function') {
                argument.removeEventListener('destroy', this);
            }
            if (typeof argument.removeParentEventTarget === 'function') {
                argument.removeParentEventTarget(this);
            }
        }
    }
    var modified = deleted.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'delete', relatedTargets: deleted, bubbles: false});
        this.dispatchEvent({type: 'afterDelete', relatedTargets: deleted});
    }
    return modified;
};

maria.SetModel.prototype.empty = function() {
    var deleted = this.toArray();
    var result = maria.Set.prototype.empty.call(this);
    if (result) {
        for (var i = 0, ilen = deleted.length; i < ilen; i++) {
            var element = deleted[i];
            if (typeof element.removeEventListener === 'function') {
                element.removeEventListener('destroy', this);
            }
            if (typeof element.removeParentEventTarget === 'function') {
                element.removeParentEventTarget(this);
            }
        }
        this.dispatchEvent({type: 'delete', relatedTargets: deleted, bubbles: false});
        this.dispatchEvent({type: 'afterDelete', relatedTargets: deleted});
    }
    return result;
};

maria.SetModel.prototype.handleEvent = function(ev) {

    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this set.
    if ((ev.type === 'destroy') &&
        (ev.currentTarget === ev.target)) {
        this['delete'](ev.target);
    }

};

// insure prototype object is initialized properly
maria.SetModel.call(maria.SetModel.prototype);
