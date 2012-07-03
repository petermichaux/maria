(function() {

    var loading = document.getElementById('loading');
    loading.parentNode.removeChild(loading);

    var productsModel = new scrollit.ProductsModel();
    var productsView = new scrollit.ProductsView(productsModel);

    document.body.appendChild(productsView.build());

    productsModel.load();

}());
