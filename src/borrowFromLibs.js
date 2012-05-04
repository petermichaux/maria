maria.borrow = function(sink, source) {
    for (var p in source) {
        if (Object.prototype.hasOwnProperty.call(source, p)) {
            sink[p] = source[p];
        }
    }
};

maria.borrow(maria, evento);
maria.borrow(maria, hijos);
maria.borrow(maria, abeja);
