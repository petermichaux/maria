maria.ElementView.subclass(scrollit, 'ProductView', {
    properties: {
        buildData: function() {
            var model = this.getModel();
            this.find('.name').innerHTML =
                model.getName().replace('&', '&amp;').replace('<', '&lt;');
            this.find('.price').innerHTML =
                (''+model.getPrice()).replace('&', '&amp;').replace('<', '&lt;');
        },
        update: function() {
            this.buildData();
        }
    }
});
