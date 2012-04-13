/*
 * Copyright (c) 2012, Peter Michaux, http://peter.michaux.ca/
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

/**

@property evento.EventTarget

@description

A constructor function for creating event target objects.

var et = new evento.EventTarget();

The methods of an event target object are inspired by the DOM2 standard.

*/
evento.EventTarget = function() {};

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

    function listenersAreEqual(n, o) {
        return n.listener === o.listener;
    }

    function hasEventListener(listeners, o) {
        for (var i = 0, ilen = listeners.length; i < ilen; i++) {
            if (listenersAreEqual(listeners[i], o)) {
                return true;
            }
        }
        return false;
    }

    function addEventListener(eventTarget, listeners, o) {
        if (hasEventListener(listeners, o)) {
            return;
        }
        if (typeof o.listener === 'function') {
            o.thisObj = eventTarget;
        }
        else {
            o.methodName = 'handleEvent';
        }
        listeners.push(o);
    }

    function removeEventListener(listeners, o) {
        // Loop backwards through the array so adjacent references
        // to "listener" are all removed.
        for (var i = listeners.length; i--; ) {
            if (listenersAreEqual(listeners[i], o)) {
                listeners.splice(i, 1);
            }
        }
    }

    function dispatchEvent(listeners, evt) {
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
            var o = listeners[i];
            if (typeof o.listener === 'function') {
                o.listener.call(o.thisObj, evt);
            }
            else {
                o.listener[o.methodName](evt);
            }
        }
    }

/**

@property evento.EventTarget.prototype.addEventListener

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@description

If the listener is an object then when a matching event type is dispatched on
the event target, the listener object's handleEvent method will be called.

If the listener is a function then when a matching event type is dispatched on
the event target, the listener function is called with event target object set as
the "this" object.

One listener (or type/listener pair to be more precise) can be added only once.

et.addEventListener('change', {handleEvent:function(){}});
et.addEventListener('change', function(){});

*/
    evento.EventTarget.prototype.addEventListener = function(type, listener) {
        hasOwnProperty(this, '_evento_listeners') || (this._evento_listeners = {});
        hasOwnProperty(this._evento_listeners, type) || (this._evento_listeners[type] = []);
        addEventListener(this, this._evento_listeners[type], {listener: listener});
    };

/**

@property evento.EventTarget.prototype.removeEventListener

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@description

Removes added listener matching the type/listener combination exactly.
If this combination is not found there are no errors.

var o = {handleEvent:function(){}};
et.removeEventListener('change', o);
et.removeEventListener('change', fn);

*/
    evento.EventTarget.prototype.removeEventListener = function(type, listener) {
        if (hasOwnProperty(this, '_evento_listeners') &&
            hasOwnProperty(this._evento_listeners, type)) {
            removeEventListener(this._evento_listeners[type], {listener: listener});
        }
    };

/**

@property evento.EventTarget.prototype.addParentEventTarget

@parameter parent {EventTarget} A parent to call when bubbling an event.

@description

When an event is dispatched on an event target, if that event target has parents
then the event is also dispatched on the parents as long as bubbling has not
been canceled on the event.

One parent can be added only once.

var o = new evento.EventTarget();
et.addParentEventTarget(o);

*/
    evento.EventTarget.prototype.addParentEventTarget = function(parent) {
        if (typeof parent.dispatchEvent !== 'function') {
            throw new TypeError('evento.EventTarget.prototype.addParentEventTarget: Parents must have dispatchEvent method.');
        }
        hasOwnProperty(this, '_evento_parents') || (this._evento_parents = []);
        for (var i=0, ilen=this._evento_parents.length; i<ilen; i++) {
            if (this._evento_parents[i] === parent) {
                // can only add a particular parent once
                return;
            }
        }
        this._evento_parents.push(parent);
    };

/**

@property evento.EventTarget.prototype.removeParentEventTarget

@parameter parent {EventTarget} The parent to remove.

@description

Removes parent added with addParentEventTarget. If the listener is
not found there are no errors.

var o = {handleEvent:function(){}};
et.removeParentEventTarget(o);

*/
    evento.EventTarget.prototype.removeParentEventTarget = function(parent) {
        if (hasOwnProperty(this, '_evento_parents')) {
            var parents = this._evento_parents;
            for (var i = 0, ilen = parents.length; i < ilen; i++) {
                var p = parents[i];
                parents.splice(i, 1);
                // no need to continue as parent can be added only once
                return;
            }
        }
    };

/**

@property evento.EventTarget.prototype.dispatchEvent

@parameter evt {object} The event object to dispatch to all listeners.

@description

The evt.type property is required. All listeners registered for this
event type are called with evt passed as an argument to the listeners.

If not set, the evt.target property will be set to be the event target.

The evt.currentTarget will be set to be the event target.

Call evt.stopPropagation() to stop bubbling to parents.

et.dispatchEvent({type:'change'});
et.dispatchEvent({type:'change', extraData:'abc'});

*/
    evento.EventTarget.prototype.dispatchEvent = function(evt) {
        // Want to ensure we don't alter the evt object passed in as it 
        // may be a bubbling event. So clone it and then setting currentTarget
        // won't break some event that is already being dispatched.
        evt = create(evt);
        ('target' in evt) || (evt.target = this); // don't change target on bubbling event
        evt.currentTarget = this;
        evt._propagationStopped = ('bubbles' in evt) ? !evt.bubbles : false;
        evt.stopPropagation = function() {
            evt._propagationStopped = true;
        };
        if (hasOwnProperty(this, '_evento_listeners') &&
            hasOwnProperty(this._evento_listeners, evt.type)) {
            dispatchEvent(this._evento_listeners[evt.type], evt);
        }
        if (hasOwnProperty(this, '_evento_parents') &&
            !evt._propagationStopped) {
            for (var i=0, ilen=this._evento_parents.length; i<ilen; i++) {
                this._evento_parents[i].dispatchEvent(evt);
            }
        }        
    };

}());

/**

@property evento.mixinEventTarget

@parameter obj {object} The object to be made into an event target.

@description

Mixes in the event target methods into any object.

var o = {}
evento.mixinEventTarget(o);
o.addEventListener('change', function(){alert('change');});
o.dispatchEvent({type:'change'});

*/
evento.mixinEventTarget = function(obj) {
    for (var p in evento.EventTarget.prototype) {
        if (Object.prototype.hasOwnProperty.call(evento.EventTarget.prototype, p) &&
            // Don't want to copy evento.EventTarget.prototype._evento_listeners object. Want the obj object
            // to have its own listeners and not share listeners with evento.EventTarget.prototype.
            (typeof evento.EventTarget.prototype[p] === 'function')) {
            obj[p] = evento.EventTarget.prototype[p];
        }
    }
};
