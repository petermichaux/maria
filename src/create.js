/**

Not all browsers supported by Maria have the native `Object.create` from ECMAScript 5.

@method

@param {Object} obj The object to be the prototype of the new object

*/
maria.create = (function () {
    function F() {}
    return function (obj) {
        F.prototype = obj;
        obj = new F();
        F.prototype = null;
        return obj;
    };
}());
