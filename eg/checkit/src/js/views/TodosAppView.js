maria.ElementView.subclass(checkit, 'TodosAppView', {
    constructor: function(model) {
        checkit.TodosAppView.superConstructor.apply(this, arguments);
        this.appendChild(new checkit.TodosInputView(model));
        this.appendChild(new checkit.TodosToolbarView(model));
        this.appendChild(new checkit.TodosListView(model));
    }
});
