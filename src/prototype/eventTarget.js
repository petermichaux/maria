/**

@property LIB_EventTarget

@description
A constructor function for creating event target objects.

var et = new LIB_EventTarget();

The methods of an event target object are inspired by the DOM2 standard.

*/
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

    function callListeners(listeners, evt) {
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
                listener.call(auxArg, evt);
            }
            else {
                listener[auxArg || 'handleEvent'](evt);
            }
        }
    }

/**

@property LIB_EventTarget.prototype.addEventListener

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@parameter auxArg {string|object} Optional. See description.

@description

If the listener is an object then when a matching event type is dispatched on
the event target, the listener object's handleEvent method will be called. 
Using the auxArg you can specify the name of the method to be called.

If the listener is a function then when a matching event type is dispatched on
the event target, the listener function is called with global object set as
the "this" object. Using the auxArg you can specifiy a different object to be
the "this" object.

One listener (or listener/auxArg pair to be more precise) can be added
multiple times.

et.addEventListener('change', {handleEvent:function(){}});
et.addEventListener('change', {handleChange:function(){}}, 'handleChange');
et.addEventListener('change', function(){});
et.addEventListener('change', this.handleChange, this);

*/
    LIB_EventTarget.prototype.addEventListener = function(type, listener, /*optional*/ auxArg) {
        hasOwnProperty(this, '_LIB_listeners') || (this._LIB_listeners = {});
        hasOwnProperty(this._LIB_listeners, type) || (this._LIB_listeners[type] = []);
        this._LIB_listeners[type].push({listener:listener, auxArg:auxArg});
    };

/**

@property LIB_EventTarget.prototype.removeEventListener

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@parameter auxArg {string|object} Optional.

@description

Removes all added listeners matching the type/listener/auxArg combination exactly.
If this combination is not found there are no errors. If this combination is found
more than once all are removed.

var o = {handleEvent:function(){}, handleChange:function(){}};
et.removeEventListener('change', o);
et.removeEventListener('change', o, 'handleChange');
et.removeEventListener('change', fn);
et.removeEventListener('change', this.handleChange, this);

*/
    LIB_EventTarget.prototype.removeEventListener = function(type, listener, /*optional*/ auxArg) {
        if (hasOwnProperty(this, '_LIB_listeners') &&
            hasOwnProperty(this._LIB_listeners, type)) {
            removeListener(this._LIB_listeners[type], listener, auxArg);
        }
    };

/**

@property LIB_EventTarget.prototype.dispatchEvent

@parameter evt {object} The event object to dispatch to all listeners.

@description

The evt.type property is required. All listeners registered for this
event type are called with evt passed as an argument to the listeners.

If not set, the evt.target property will be set to be the event target.

The evt.currentTarget will be set to be the event target.

et.dispatchEvent({type:'change'});
et.dispatchEvent({type:'change', extraData:'abc'});

*/
    LIB_EventTarget.prototype.dispatchEvent = function(evt) {
        // Want to ensure we don't alter the evt object passed in as it 
        // may be a bubbling event. So clone it and then setting currentTarget
        // won't break some event that is already being dispatched.
        evt = create(evt);
        ('target' in evt) || (evt.target = this); // don't change target on bubbling event
        evt.currentTarget = this; // change currentTarget on a bubbling event
        if (hasOwnProperty(this, '_LIB_listeners')) {
            if (hasOwnProperty(this._LIB_listeners, evt.type)) {
                callListeners(this._LIB_listeners[evt.type], evt);
            }
            if (hasOwnProperty(this._LIB_listeners, 'LIB_all')) {
                callListeners(this._LIB_listeners.LIB_all, evt);
            }
        }
    };

}());

/**

@property LIB_mixinEventTarget

@parameter obj {object} The object to be made into an event target.

@description

Mixes in the event target methods into any object.

var o = {}
LIB_mixinEventTarget(o);
o.addEventListener('change', function(){alert('change');});
o.dispatchEvent({type:'change'});

*/
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


/**

@property LIB_implementsEventTarget

@parameter obj {object} The object to verify as an event target.

@description

Check that the obj parameter is an event target.

*/
var LIB_implementsEventTarget = function(obj) {
    return !!(obj.addEventListener &&
              obj.removeEventListener &&
              obj.dispatchEvent);
};
