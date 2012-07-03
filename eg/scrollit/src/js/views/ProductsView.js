maria.SetView.subclass(scrollit, 'ProductsView', {
    uiActions: {
        'scroll .productsListWrapper': 'onScroll'
    },
    properties: {
        isScrolledToBottom: function() {
            var wrapper = this.find('.productsListWrapper');
            var scrollTop = wrapper.scrollTop;
            var scrollHeight = wrapper.scrollHeight;
            var height = wrapper.clientHeight;
            return (scrollHeight - scrollTop) === height;
        },
        createChildView: function(productModel) {
            return new scrollit.ProductView(productModel);
        },
        buildData: function() {
            this.find('.loading').style.display = this.getModel().isLoading() ? '' : 'none';
        },
        update: function(evt) {
            maria.SetView.prototype.update.call(this, evt);
            this.buildData();
        },
        getContainerEl: function() {
            return this.find('.productsList');
        }
    }
});
