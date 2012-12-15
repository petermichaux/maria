maria.addEventListener = function() {
    evento.addEventListener.apply(this, arguments);
};

maria.removeEventListener = function() {
    evento.removeEventListener.apply(this, arguments);
};

maria.purgeEventListener = function() {
    evento.purgeEventListener.apply(this, arguments);
};
