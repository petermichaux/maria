var LIB_makeObservableArray;

(function() {

    // utility to help wrapping Array.prototype methods
    //
    function forEach(arr, fn) {
        for (var i = 0, ilen = arr.length; i < ilen; i++) {
            fn(arr[i]);
        }
    }

    LIB_makeObservableArray = function() {

        var elements = Array.prototype.slice.call(arguments, 0);

        var self = {};

        LIB_mixinSubject(self);

        // Since Object.defineProperty is not universally supported
        // we make length an accessor method instead.
        //
        self.getLength = function() {
            return elements.length;
        };

        // Need a getter as we don't have arr[2] syntax for an observable array.
        //
        self.get = function(i) {
            return elements[i];
        };

        // Wrap Array.prototype non-mutators methods.
        //
        // The arguments to concat should be regular arrays and values. Not observable arrays unless
        // you want an observable array as one of the elements of the final array.
        //
        // Note the results of concat, slice, filter, and map are regular Array instances. They
        // are not observable. If you need them to be observable then wrap the result.
        //
        forEach(['concat', 'join', 'slice', 'indexOf', 'lastIndexOf', 'filter',
                 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'],
            function(method) {
                // Match browser methods. If the browser has the methods
                // or the browser has been polyfilled then include
                // the newer methods on observable arrays.
                if (typeof Array.prototype[method] === 'function') {
                    self[method] = function() {
                        return Array.prototype[method].apply(elements, arguments);
                    };
                }
            });

        // We need a setter as we don't have arr[2]='c' syntax for an observable array.
        //
        self.set = function(i, element) {
            var result = (elements[i] = element);
            self.dispatchEvent({type:'mutate'});
            return result;
        };

        // Wrap Array.prototype mutator methods.
        //
        forEach(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'],
            function(method) {
                if (typeof Array.prototype[method] === 'function') {
                    self[method] = function() {
                        var result = Array.prototype[method].apply(elements, arguments);
                        self.dispatchEvent({type:'mutate'});
                        return result;
                    };
                }
            });

        // ---------------------------------------------------------

        return self;
    };
    
}());

var LIB_mixinObservableArray = function(obj) {
    var oa = LIB_makeObservableArray();
    for (var p in oa) {
        if (Object.prototype.hasOwnProperty.call(oa, p)) {
            obj[p] = oa[p];
        }
    }
};

// var oa = LIB_makeObservableArray('a', 'b');
// oa.addEventListener('mutate', function() {alert('mutated')});
// oa.push('c'); // will show an alert from the above listener
// oa.get(1);    // 'b'
