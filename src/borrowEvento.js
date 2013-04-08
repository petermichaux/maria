/**

Add an event listener.

See evento.on for description.

*/
maria.on = function() {
    evento.on.apply(this, arguments);
};

/**

Remove an event listener.

See evento.off for description.

*/
maria.off = function() {
    evento.off.apply(this, arguments);
};

/**

Purge an event listener of all its subscriptions.

See evento.purge for description.

*/
maria.purge = function() {
    evento.purge.apply(this, arguments);
};
