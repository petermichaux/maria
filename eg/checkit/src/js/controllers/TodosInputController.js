maria.Controller.subclass(checkit, 'TodosInputController', {
    properties: {
        onFocusInput: function() {
            this.onKeyupInput();
        },
        onBlurInput: function() {
            this.getView().setPending(false);
        },
        onKeyupInput: function() {
            var view = this.getView();
            view.setPending(!checkit.isBlank(view.getInputValue()));
        },
        onKeypressInput: function(evt) {
            if (evt.keyCode == 13) {
                var view = this.getView();
                var value = view.getInputValue();
                if (!checkit.isBlank(value)) {
                    var todo = new checkit.TodoModel();
                    todo.setContent(value);
                    this.getModel().add(todo);
                    view.clearInput();
                }
            }
        }
    }
});
