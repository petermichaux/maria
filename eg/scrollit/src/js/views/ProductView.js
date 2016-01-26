maria.ElementView.subclass(scrollit, 'ProductView', {
    properties: {
        buildData: function () {
            var model = this.getModel();
            this.find('.name').innerHTML = scrollit.escapeHTML(model.getName());
            this.find('.price').innerHTML = scrollit.escapeHTML('' + model.getPrice());
        },
        update: function () {
            this.buildData();
        }
    }
});
