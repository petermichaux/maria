maria.Controller.subclass(scrollit, 'ProductsController', {
    properties: {
        onScroll: function() {
            if (this.getView().isScrolledToBottom()) {
                this.getModel().load();
            }
        }
    }
});
