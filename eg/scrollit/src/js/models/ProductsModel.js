maria.SetModel.subclass(scrollit, 'ProductsModel', {
    elementConstructorName: 'ProductModel',
    attributes: {
        loading: {
            type: 'boolean'
        },
        complete: {
            type: 'boolean'
        },
        nextOffset: {
            type: 'number',
            integer: true,
            min: 0
        }
    },
    properties: {
        load: function () {
            if (this.isComplete() || this.isLoading()) {
                return;
            }
            this.setLoading(true);
            var self = this;
            myth.xhr('GET', '/products.json?offset=' + this.getNextOffset(), {
                on200: function (xhr) {
                    var productsJSON = JSON.parse(xhr.responseText);
                    if (productsJSON.length < 1) {
                        self.setComplete(true);
                    } else {
                        self.setNextOffset(self.getNextOffset() + productsJSON.length);
                        self.fromJSON(productsJSON);
                    }
                    self.setLoading(false);
                }
                // TODO other callbacks
            });
        }
    }
});
