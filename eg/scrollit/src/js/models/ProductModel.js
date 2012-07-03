maria.Model.subclass(scrollit, 'ProductModel', {
    properties: {
        getId: function() {
            return this._id;
        },
        getName: function() {
            return this._name;
        },
        getPrice: function() {
            return this._price;
        }
    }
});

scrollit.ProductModel.fromJSON = function(productJSON) {
    var model = new scrollit.ProductModel();
    model._id = productJSON.id;
    model._name = productJSON.name;
    model._price = productJSON.price;
    return model;
};
