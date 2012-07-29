maria.SetModel.subclass(scrollit, 'ProductsModel', {
    properties: {
        _isLoading: false,
        _isComplete: false,
        _nextOffset: 0,
        isLoading: function() {
            return this._isLoading;
        },
        isComplete: function() {
            return this._isComplete;
        },
        load: function() {
            if (this._isComplete || this._isLoading) {
                return;
            }
            this._isLoading = true;
            this.dispatchEvent({type: 'change'});
            var self = this;
            myth.xhr('GET', '/products.json?offset='+this._nextOffset, {
                on200: function(xhr) {
                    var productsJSON = JSON.parse(xhr.responseText);
                    if (productsJSON.length < 1) {
                        self._isComplete = true;
                    } else {
                        var products = [];
                        for (var i = 0, ilen = productsJSON.length; i < ilen; i++) {
                            products.push(scrollit.ProductModel.fromJSON(productsJSON[i]));
                        }
                        self._nextOffset += products.length;
                        self.add.apply(self, products);
                    }
                    self._isLoading = false;
                    self.dispatchEvent({type: 'change'});
                }
                // TODO other callbacks
            });
        }
    }
});
