/**

Copy properties from the source to the sink.

@param {Object} sink The destination object.

@param {Object} source The source object.

*/
maria.borrow = function (sink, source) {
    for (var p in source) {
        if (Object.prototype.hasOwnProperty.call(source, p)) {
            sink[p] = source[p];
        }
    }
};
