var LIB_EventTarget = function() {};

(function() {

    function hasOwnProperty(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
    }

    var create = (function() {
        function F() {}
        return function(o) {
            F.prototype = o;
            return new F();
        };
    }());

    function removeListener(listeners, listener, auxArg) {
        // Loop backwards through the array so adjacent references
        // to "listener" are all removed.
        for (var i = listeners.length; i--; ) {
            if ((listeners[i].listener === listener) &&
                (listeners[i].auxArg === auxArg)) {
                listeners.splice(i, 1);
            }
        }
    }

    function callListeners(listeners, data) {
        // Copy the list of listeners in case one of the
        // listeners modifies the list while we are
        // iterating over the list.
        //
        // Without making a copy, one listener removing
        // an already-called listener would result in skipping
        // a not-yet-called listener. One listener removing 
        // a not-yet-called listener would result in skipping that
        // not-yet-called listner. The worst case scenario 
        // is a listener adding itself again which would
        // create an infinite loop.
        // 
        listeners = listeners.slice(0);
        for (var i = 0, ilen = listeners.length; i < ilen; i++) {
            var listener = listeners[i].listener;
            var auxArg = listeners[i].auxArg;
            if (typeof listener === 'function') {
                listener.call(auxArg, data);
            }
            else {
                listener[auxArg || 'handleEvent'](data);
            }
        }
    }

    // "event" is an event name string.
    // "listener" is an object or callback function.
    // "auxArg" If listener is an object then auxArg is the name of the method to call
    // on listener. Default "handleEvent". If "listener" is a function then auxArg
    // is the object to use as the value of "this" when listener is called.
    //
    // One listener can be added multiple times.
    //
    LIB_EventTarget.prototype.addEventListener = function(event, listener, /*optional*/ auxArg) {
        hasOwnProperty(this, '_LIB_listeners') || (this._LIB_listeners = {});
        hasOwnProperty(this._LIB_listeners, event) || (this._LIB_listeners[event] = []);
        this._LIB_listeners[event].push({listener:listener, auxArg:auxArg});
    };

    // addEventListener allows one listener to be added multiple times.
    // We remove all references to "listener".
    //
    // No complaints if the "listener" is not found in the list.
    //
    LIB_EventTarget.prototype.removeEventListener = function(event, listener, /*optional*/ auxArg) {
        if (hasOwnProperty(this, '_LIB_listeners') &&
            hasOwnProperty(this._LIB_listeners, event)) {
            removeListener(this._LIB_listeners[event], listener, auxArg);
        }
    };

    // The "data" will be pushed to each listener as the event object.
    // The "data.type" value is required and must be a string name of an event type.
    //
    LIB_EventTarget.prototype.dispatchEvent = function(data) {
        // Want to ensure we don't alter the data object passed in as it 
        // may be a bubbling event. So clone it and then setting currentTarget
        // won't break some event that is already being dispatched.
        data = create(data);
        ('target' in data) || (data.target = this); // don't change target on bubbling event
        data.currentTarget = this; // change currentTarget on a bubbling event
        if (hasOwnProperty(this, '_LIB_listeners')) {
            if (hasOwnProperty(this._LIB_listeners, data.type)) {
                callListeners(this._LIB_listeners[data.type], data);
            }
            if (hasOwnProperty(this._LIB_listeners, 'LIB_all')) {
                callListeners(this._LIB_listeners.LIB_all, data);
            }
        }
    };

}());

var LIB_mixinEventTarget = function(obj) {
    for (var p in LIB_EventTarget.prototype) {
        if (Object.prototype.hasOwnProperty.call(LIB_EventTarget.prototype, p) &&
            // Don't want to copy LIB_EventTarget.prototype._LIB_listeners object. Want the obj object
            // to have its own listeners and not share listeners with LIB_EventTarget.prototype.
            (typeof LIB_EventTarget.prototype[p] === 'function')) {
            obj[p] = LIB_EventTarget.prototype[p];
        }
    }
};

var LIB_implementsEventTarget = function(obj) {
    return !!(obj.addEventListener &&
              obj.removeEventListener &&
              obj.dispatchEvent);
};
