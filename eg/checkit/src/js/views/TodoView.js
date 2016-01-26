maria.ElementView.subclass(checkit, 'TodoView', {
    uiActions: {
        'click .checkbox': 'onClickCheckbox'
    },
    properties: {
        buildData: function () {
            var model = this.getModel();
            this.find('.content').innerHTML = checkit.escapeHTML(model.getContent());
            aristocrat[model.isDone() ? 'addClass' : 'removeClass'](
                this.find('.Todo'), 'TodoDone');
        },
        update: function () {
            this.buildData();
        }
    }
});