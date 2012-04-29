maria.SetView = function() {
    maria.View.apply(this, arguments);
};

maria.SetView.prototype = new maria.View();
maria.SetView.prototype.constructor = maria.SetView;

maria.SetView.prototype.getModelEventMap = function() {
    return {
        'add': 'handleAdd',
        'delete': 'handleDelete'
    };
};

maria.SetView.prototype.handleAdd = function() {
    // override
};

maria.SetView.prototype.handleDelete = function() {
    // override
};
