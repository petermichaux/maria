maria.Controller.subclass(checkit, 'TodosInputController', {
    properties: {
        onFocusInput: function() {
            this.onKeyupInput();
        },
        onBlurInput: function() {
            this.getView().hideToolTip();
        },
        onKeyupInput: function() {
            var view = this.getView();
            if (checkit.isBlank(view.getInputValue())) {
                view.hideToolTip();
            } else {
                view.showToolTip();
            }
        },
        onKeypressInput: function(evt) {
            if (evt.keyCode != 13) {
                return;
            }
            var view = this.getView();
            var value = view.getInputValue();
            if (checkit.isBlank(value)) { // don't create an empty Todo
                return;
            }
            var todo = new checkit.TodoModel();
            todo.setContent(value);
            this.getModel().add(todo);
            view.clearInput();
        }
    }
});
