maria.Controller.subclass(checkit, 'TodosToolbarController', {
    properties: {
        onClickAllCheckbox: function() {
            var model = this.getModel();
            if (model.isAllDone()) {
                model.markAllUndone();
            } else {
                model.markAllDone();
            }
        },
        onClickDeleteDone: function() {
            this.getModel().deleteDone();
        }
    }
});
