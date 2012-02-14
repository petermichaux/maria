// A SICP-style constructor function for creating a subject object.
// The goal here is to hide the listeners so no one can mutate it directly.
//
var LIB_makeSubject = function() {

    var listeners = {};

    return {

        // "event" is an event name string.
        // "listener" is a callback function.
        //
        // One listener can be added multiple times.
        //
        addEventListener: function(event, listener) {
            Object.prototype.hasOwnProperty.call(listeners, event) || (listeners[event] = []);
            listeners[event].push(listener);
        },

        // addEventListener allows one listener to
        // be added multiple times. We removed all references
        // to "listener".
        //
        // No complaints if the "listener" is not found in the list.
        //
        removeEventListener: function(event, listener) {
            if (Object.prototype.hasOwnProperty.call(listeners, event)) {
                // Loop backwards through the array so adjacent references
                // to "listener" are all removed.
                for (var i = listeners[event].length; i--; ) {
                    if (listeners[event][i] === listener) {
                        listeners[event].splice(i, 1);
                    }
                }
            }
        },

        // The "data" will be pushed to each listener.
        // The "data.type" value is required and must be a string name
        // of an event type.
        //
        dispatchEvent: function(data) {
            if (Object.prototype.hasOwnProperty.call(listeners, data.type)) {
                // Copy the list of listeners in case one of the
                // listeners modifies the list while we are
                // iterating over the list.
                var ls = listeners[data.type].slice(0);
                for (var i = 0, ilen = ls.length; i < ilen; i++) {
                    ls[i](data);
                }
            }
        }

    };

};

var LIB_mixinSubject = function(obj) {
    var subject = LIB_makeSubject();
    for (var p in subject) {
        if (Object.prototype.hasOwnProperty.call(subject, p)) {
            obj[p] = subject[p];
        }
    }
};


// var APP_makeNewspaper = function(name) {
//     var self = {
//         getName: function() {
//             return name;
//         }
//     };
//     LIB_mixinSubject(self);
//     return self;
// };
//
// var times = APP_makeNewspaper('The Times');
// times.addEventListener('publish', function() {});
// times.dispatchEvent({type:'publish'});
