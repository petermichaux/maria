maria.ElementView.subclass(checkit, 'TodosAppView', {
    constructor: function(model) {
        maria.ElementView.apply(this, arguments);
        this.appendChild(new checkit.TodosInputView(model));
        this.appendChild(new checkit.TodosToolbarView(model));
        this.appendChild(new checkit.TodosListView(model));
    }
});
