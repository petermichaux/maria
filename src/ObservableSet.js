// LIB_ObservableSet inherits from LIB_Set.
//
var LIB_ObservableSet = function() {
    LIB_Set.apply(this, arguments);
    evento.EventTarget.call(this);
};

LIB_ObservableSet.prototype = new LIB_Set();
LIB_ObservableSet.prototype.constructor = LIB_ObservableSet;

evento.EventTarget.mixin(LIB_ObservableSet.prototype);

// Wrap the set mutator methods to dispatch events.

// takes multiple arguments so that only one event will be fired
//
LIB_ObservableSet.prototype.add = function() {
    var added = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (LIB_Set.prototype.add.call(this, argument)) {
            added.push(argument);
            if ((typeof argument.addEventListener === 'function') &&
                (typeof argument.removeEventListener === 'function')) {
                argument.addEventListener('LIB_destroy', this);    
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
        this.dispatchEvent({type: 'LIB_add', relatedTargets: added, bubbles: false});
        this.dispatchEvent({type: 'LIB_afterAdd', relatedTargets: added});
    }
    return modified;
};

// takes multiple arguments so that only one event will be fired
//
LIB_ObservableSet.prototype['delete'] = function() {
    var deleted = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (LIB_Set.prototype['delete'].call(this, argument)) {
            deleted.push(argument);
            if (typeof argument.removeEventListener === 'function') {
                argument.removeEventListener('LIB_destroy', this);
            }
            if (typeof argument.removeParentEventTarget === 'function') {
                argument.removeParentEventTarget(this);
            }
        }
    }
    var modified = deleted.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'LIB_delete', relatedTargets: deleted, bubbles: false});
        this.dispatchEvent({type: 'LIB_afterDelete', relatedTargets: deleted});
    }
    return modified;
};

LIB_ObservableSet.prototype.empty = function() {
    var deleted = this.toArray();
    var result = LIB_Set.prototype.empty.call(this);
    if (result) {
        for (var i = 0, ilen = deleted.length; i < ilen; i++) {
            var element = deleted[i];
            if (typeof element.removeEventListener === 'function') {
                element.removeEventListener('LIB_destroy', this);
            }
            if (typeof element.removeParentEventTarget === 'function') {
                element.removeParentEventTarget(this);
            }
        }
        this.dispatchEvent({type: 'LIB_delete', relatedTargets: deleted, bubbles: false});
        this.dispatchEvent({type: 'LIB_afterDelete', relatedTargets: deleted});
    }
    return result;
};

LIB_ObservableSet.prototype.handleEvent = function(ev) {

    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this set.
    if ((ev.type === 'LIB_destroy') &&
        (ev.currentTarget === ev.target)) {
        this['delete'](ev.target);
    }

};
