maria.create = (function() {
    function F() {}
    return function(obj) {
        F.prototype = obj;
        return new F();
    };
}());
