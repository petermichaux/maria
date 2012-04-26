(function() {
    function borrow(source) {
        for (var p in source) {
            if (Object.prototype.hasOwnProperty.call(source, p)) {
                maria[p] = source[p];
            }
        }
    }
    borrow(evento);
    borrow(hijos);
}());
