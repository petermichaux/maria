maria.ElementView.subclass(checkit, 'TodosToolbarView', {
    uiActions: {
        'click .allCheckbox': 'onClickAllCheckbox',
        'click .deleteDone' : 'onClickDeleteDone'
    },
    properties: {
        buildData: function () {
            var model = this.getModel();
            var checkbox = this.find('.allCheckbox');
            var button = this.find('.deleteDone');
            var isAllDone = model.isAllDone();
            aristocrat[isAllDone ? 'addClass' : 'removeClass'](
                this.find('.allCheckbox'), 'allCheckboxAllDone');
            button.disabled = model.isAllUndone();
        },
        update: function () {
            this.buildData();
        }
    }
});
