var LIB_Subject = function() {};

(function() {

    function has(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
    }

    function removeListener(listeners, listener, thisObj) {
        // Loop backwards through the array so adjacent references
        // to "listener" are all removed.
        for (var i = listeners.length; i--; ) {
            if ((listeners[i].listener === listener) &&
                ((!thisObj) || (listeners[i].thisObj === thisObj))) {
                listeners.splice(i, 1);
            }
        }
    }

    function callListeners(listeners, data) {
        // Copy the list of listeners in case one of the
        // listeners modifies the list while we are
        // iterating over the list.
        listeners = listeners.slice(0);
        for (var i = 0, ilen = listeners.length; i < ilen; i++) {
            listeners[i].listener.call(listeners[i].thisObj, data);
        }
    }

    // "event" is an event name string.
    // "listener" is a callback function.
    //
    // One listener can be added multiple times.
    //
    LIB_Subject.prototype.addEventListener = function(event, listener, thisObj) {
        has(this, '_LIB_listeners') || (this._LIB_listeners = {});
        has(this._LIB_listeners, event) || (this._LIB_listeners[event] = []);
        this._LIB_listeners[event].push({listener:listener, thisObj:thisObj});
    };

    // addEventListener allows one listener to be added multiple times.
    // We remove all references to "listener".
    //
    // No complaints if the "listener" is not found in the list.
    //
    LIB_Subject.prototype.removeEventListener = function(event, listener, thisObj) {
        if (has(this, '_LIB_listeners') &&
            has(this._LIB_listeners, event)) {
            removeListener(this._LIB_listeners[event], listener, thisObj);
        }
    };

    // The "data" will be pushed to each listener.
    // The "data.type" value is required and must be a string name of an event type.
    //
    LIB_Subject.prototype.dispatchEvent = function(data) {
        if (has(this, '_LIB_listeners')) {
            if (has(this._LIB_listeners, data.type)) {
                callListeners(this._LIB_listeners[data.type], data);
            }
            if (has(this._LIB_listeners, 'LIB_all')) {
                callListeners(this._LIB_listeners.LIB_all, data);
            }
        }
    };

}());

var LIB_mixinSubject = function(obj) {
    for (var p in LIB_Subject.prototype) {
        if (Object.prototype.hasOwnProperty.call(LIB_Subject.prototype, p) &&
            // Don't want to copy LIB_Subject.prototype._LIB_listeners object. Want the obj object
            // to have its own listeners and not share listeners with LIB_Subject.prototype.
            (typeof LIB_Subject.prototype[p] === 'function')) {
            obj[p] = LIB_Subject.prototype[p];
        }
    }
};
