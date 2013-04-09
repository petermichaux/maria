maria.Controller.subclass(checkit, 'TodoController', {
    properties: {
        onClickCheckbox: function() {
            this.getModel().toggleDone();
        }
    }
});
