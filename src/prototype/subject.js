// A prototypical subject object.
//
var LIB_subject;

(function() {

    var has = function(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
    };

    function removeListener(listeners, listener) {
        // Loop backwards through the array so adjacent references
        // to "listener" are all removed.
        for (var i = listeners.length; i--; ) {
            if (listeners[i] === listener) {
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
            listeners[i](data);
        }
    }

    LIB_subject = {

        // "event" is an event name string.
        // "listener" is a callback function.
        //
        // One listener can be added multiple times.
        //
        addEventListener: function(event, listener) {
            if (listener) {
                has(this, '_listeners') || (this._listeners = {});
                has(this._listeners, event) || (this._listeners[event] = []);
                this._listeners[event].push(listener);
            }
            else {
                // the listener function for all events is in the event variable
                has(this, '_allListeners') || (this._allListeners = []);
                this._allListeners.push(event);
            }
        },

        // addEventListener allows one listener to be added multiple times.
        // We remove all references to "listener".
        //
        // No complaints if the "listener" is not found in the list.
        //
        removeEventListener: function(event, listener) {
            if (listener) {
                if (has(this, '_listeners') &&
                    has(this._listeners, event)) {
                    removeListener(this._listeners[event], listener);
                }
            }
            else {
                // the listener function for all events is in the event variable
                if (has(this, '_allListeners')) {
                    removeListener(this._allListeners, event);
                }
            }
        },

        // The "data" will be pushed to each listener.
        // The "data.type" value is required and must be a string name of an event type.
        //
        dispatchEvent: function(data) {
            if (has(this, '_listeners') &&
                has(this._listeners, data.type)) {
                callListeners(this._listeners[data.type], data);
            }
            if (has(this, '_allListeners')) {
                callListeners(this._allListeners, data);
            }
        }

    };

}());


var LIB_Subject = function() {
    // The constructor property is unreliable in general
    // but in case someone is depending on it we repair it.
    this.constructor = LIB_Subject;
};
LIB_Subject.prototype = LIB_subject;


var LIB_mixinSubject = function(obj) {
    for (var p in LIB_subject) {
        if (Object.prototype.hasOwnProperty.call(LIB_subject, p) &&
            // Don't want to copy LIB_subject._listeners object. Want the obj object
            // to have its own listeners and not share listeners with LIB_subject.
            (typeof LIB_subject[p] === 'function')) {
            obj[p] = LIB_subject[p];
        }
    }
};


// The pub/sub pattern works with the global LIB_subject object
// because it is a fully-fledged subject object.
//
// LIB_subject.addEventListener('foo', function(data) {
//     console.log(data.tweet);
// });
// LIB_subject.addEventListener('bar', function(data) {
//     console.log(data.tweet);
// });
// LIB_subject.dispatchEvent({
//     type: 'foo', 
//     tweet: 'Great sandwich!'
// });


// New subject objects can be created.
//
// var twitter = new LIB_Subject();
// twitter.addEventListener('foo', function(data) {
//     console.log(data.tweet);
// });
// twitter.addEventListener('bar', function(data) {
//     console.log(data.tweet);
// });
// twitter.dispatchEvent({
//     type: 'foo', 
//     tweet: 'So tired!'
// });


// The subject methods can be mixed into 
// other objects.
//
// function APP_Twitter(name) {
//     this.name = name;
// };
// LIB_mixinSubject(APP_Twitter.prototype);
//
// var tweetsRUs = new APP_Twitter('Tweets R Us');
// tweetsRUs.addEventListener('foo', function(data) {
//     console.log(data.tweet);
// });
// tweetsRUs.addEventListener('bar', function(data) {
//     console.log(data.tweet);
// });
// tweetsRUs.dispatchEvent({
//     type: 'foo',
//     tweet: 'Homework sucks!'
// });


// And even the APP_Twitter.prototype object
// is still a fully functioning subject object
// with its own listeners.
// 
// APP_Twitter.prototype.addEventListener('foo', function(data) {
//     console.log(data.tweet);
// });
// APP_Twitter.prototype.addEventListener('bar', function(data) {
//     console.log(data.tweet);
// });
// APP_Twitter.prototype.dispatchEvent({
//     type: 'foo', 
//     tweet: 'No thoughts lately.'
// });
