/**

Returns `true` if the test function returns true for at least one element in
the array.

    maria.some([1, 2, 3], function (a) {return a === 2;}); // true

Same idea as `Array.prototype.some` in modern JavaScript engines.

@param {Array} arr The array.

@param {function} fn The test function.

@return {boolean} `true` if `fn` returns `true` for at least one element in `arr`. Otherwise `false`.

*/
maria.some = function (arr, fn) {
    for (var i = 0, ilen = arr.length; i < ilen; i++) {
        if (fn(arr[i])) {
            return true;
        }
    }
    return false;
};
