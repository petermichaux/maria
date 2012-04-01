// LIB_ObservableSet inherits from LIB_Set.
//
var LIB_ObservableSet = function() {
    LIB_Set.apply(this, arguments);
};

LIB_ObservableSet.prototype = new LIB_Set();
LIB_ObservableSet.prototype.constructor = LIB_ObservableSet;

LIB_mixinEventTarget(LIB_ObservableSet.prototype);

// Wrap the set mutator methods to dispatch events.

LIB_ObservableSet.prototype.add = function() {
    var added = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (LIB_Set.prototype.add.call(this, argument)) {
            added.push(argument);
            if (LIB_implementsEventTarget(argument)) {
                argument.addAllEventListener(this, 'elementListener');
            }
        }
    }
    var modified = added.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'LIB_add', relatedTargets: added, cancelBubble: true});
        this.dispatchEvent({type: 'LIB_afterAdd', relatedTargets: added});
    }
    return modified;
};

LIB_ObservableSet.prototype['delete'] = function() {
    var deleted = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (LIB_Set.prototype['delete'].call(this, argument)) {
            deleted.push(argument);
            if (LIB_implementsEventTarget(argument)) {
                argument.removeAllEventListener(this, 'elementListener');
            }
        }
    }
    var modified = deleted.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'LIB_delete', relatedTargets: deleted, cancelBubble: true});
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
            if (LIB_implementsEventTarget(element)) {
                element.removeAllEventListener(this, 'elementListener');
            }
        }
        this.dispatchEvent({type: 'LIB_delete', relatedTargets: deleted, cancelBubble: true});
        this.dispatchEvent({type: 'LIB_afterDelete', relatedTargets: deleted});
    }
    return result;
};

LIB_ObservableSet.prototype.elementListener = function(ev) {

    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this set.
    if ((ev.type === 'LIB_destroy') &&
        (ev.currentTarget === ev.target)) {
        this['delete'](ev.target);
    }

    // bubble the event
    if (!ev.cancelBubble) {
        this.dispatchEvent(ev);
    }

};
