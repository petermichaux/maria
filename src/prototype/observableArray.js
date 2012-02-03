// A prototypical observable array object cunningly written
// to enable easy mixins.
//
var LIB_observableArray;

(function() {

    // utility to help wrapping Array.prototype methods
    //
    function forEach(arr, fn) {
        for (var i = 0, ilen = arr.length; i < ilen; i++) {
            fn(arr[i]);
        }
    }

    LIB_observableArray = {};

    LIB_mixinSubject(LIB_observableArray);

    // Since Object.defineProperty is not universally supported
    // we make length an accessor method instead.
    //
    LIB_observableArray.getLength = function() {
        return this._elements ? this._elements.length : 0;
    };

    // Need a getter as we don't have arr[2] syntax for an observable array.
    //
    LIB_observableArray.get = function(i) {
        return this._elements ? this._elements[i] : undefined;
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
                LIB_observableArray[method] = function() {
                    return Array.prototype[method].apply(this._elements || [], arguments);
                };
            }
        });

    // We need a setter as we don't have arr[2]='c' syntax for an observable array.
    //
    LIB_observableArray.set = function(i, element) {
        this._elements = this._elements || [];
        var result = (this._elements[i] = element);
        this.dispatchEvent({type:'mutate'});
        return result;
    };

    // Wrap Array.prototype mutator methods.
    //
    forEach(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'],
        function(method) {
            if (typeof Array.prototype[method] === 'function') {
                LIB_observableArray[method] = function() {
                    this._elements = this._elements || [];
                    var result = Array.prototype[method].apply(this._elements, arguments);
                    this.dispatchEvent({type:'mutate'});
                    return result;
                };
            }
        });

}());

var LIB_mixinObservableArray = function(obj) {
    for (var p in LIB_observableArray) {
        if (Object.prototype.hasOwnProperty.call(LIB_observableArray, p)) {
            obj[p] = LIB_observableArray[p];
        }
    }
};

var LIB_ObservableArray = function() {
    this._elements = Array.prototype.slice.call(arguments, 0);
};
LIB_mixinObservableArray(LIB_ObservableArray.prototype);

// var oa = new LIB_ObservableArray('a', 'b');
// oa.addEventListener('mutate', function() {alert('mutated')});
// oa.push('c'); // will show an alert from the above listener
// oa.get(1);    // 'b'
