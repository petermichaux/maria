maria.ElementView.subclass(checkit, 'TodosStatsView', {
    modelConstructor: checkit.TodosModel,
    modelActions: {
        'add'   : 'update',
        'delete': 'update'
    },
    properties: {
        update: function() {
            this.find('.todos-count').innerHTML = this.getModel().length;
        },
        focus: function() {}
    }
});
