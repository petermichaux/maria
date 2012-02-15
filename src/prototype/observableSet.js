// LIB_ObservableSet inherits from LIB_Set.
//
var LIB_ObservableSet = function() {
    LIB_Set.apply(this, arguments);
};

LIB_ObservableSet.prototype = new LIB_Set();
LIB_ObservableSet.prototype.constructor = LIB_ObservableSet;

LIB_mixinSubject(LIB_ObservableSet.prototype);

// Wrap the set mutator methods to dispatch events.

LIB_ObservableSet.prototype.add = function(element) {
    var modified = LIB_Set.prototype.add.call(this, element);
    if (modified) {
        if (LIB_implementsSubject(element)) {
            element.addEventListener('LIB_all', this.elementListener, this);
        }
        this.dispatchEvent({type: 'LIB_add', relatedTarget: element});
    }
    return modified;
};

LIB_ObservableSet.prototype['delete'] = function(element) {
    var modified = LIB_Set.prototype['delete'].call(this, element);
    if (modified) {
        if (LIB_implementsSubject(element)) {
            element.removeEventListener('LIB_all', this.elementListener, this);
        }
        this.dispatchEvent({type: 'LIB_delete', relatedTarget: element});
    }
    return modified;
};

LIB_ObservableSet.prototype.elementListener = function(ev) {
    // bubble the event
    this.dispatchEvent(ev);
    
    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this set.
    if ((ev.type === 'LIB_destroy') &&
        (ev.currentTarget === ev.target)) {
        this['delete'](ev.target);
    }
};
