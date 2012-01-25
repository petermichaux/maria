// A prototypical subject object cunningly written
// to enable easy mixins.
//
var LIB_subject = {
    
    // "event" is an event name string.
    // "listener" is a callback function.
    //
    // One listener can be added multiple times.
    //
    addEventListener: function(event, listener) {
        this.listeners = this.listeners || {};
        if (this.listeners[event]) {
            this.listeners[event].push(listener);
        }
        else {
            this.listeners[event] = [listener];
        }
    },
    
    // addEventListener allows one listener to 
    // be added multiple times. We removed all references
    // to "listener".
    //
    // No complaints if the "listener" is not found in the list.    
    //
    removeEventListener: function(event, listener) {
        if (this.listeners && this.listeners[event]) {
            // Loop backwards through the array so adjacent references 
            // to "listener" are all removed.
            for (var i = this.listeners[event].length; i--; ) {
                if (this.listeners[event][i] === listener) {
                    this.listeners[event].splice(i, 1);
                }
            }
        }
    },
    
    // The "data" will be pushed to each listener.
    // The "data.type" value is required and must be a string name
    // of an event type.
    //
    dispatchEvent: function(data) {
        if (this.listeners && this.listeners[data.type]) {
            // Copy the list of listeners in case one of the 
            // listeners modifies the list while we are 
            // iterating over the list.
            var listeners = this.listeners[data.type].slice(0);
            for (var i = 0, ilen = listeners.length; i < ilen; i++) {
                listeners[i](data);
            }
        }
    }

};

var LIB_mixinSubject = function(obj) {
    for (var p in LIB_subject) {
        if (Object.prototype.hasOwnProperty.call(LIB_subject, p)) {
            obj[p] = LIB_subject[p];
        }
    }
};

var LIB_Subject = function() {};
LIB_mixinSubject(LIB_Subject.prototype);

// function APP_Newspaper(name) {
//     this.name = name;
// };
// LIB_mixinSubject(APP_Newspaper.prototype);
// 
// var times = new APP_Newspaper('The Times');
// times.addEventListener('publish', function() {});
// times.dispatchEvent({type:'publish'});
//
// var subject = new LIB_Subject();
