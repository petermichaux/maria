maria.on(window, 'load', function () {

    var model = new checkit.TodosModel();

    var view = new checkit.TodosAppView(model);
    document.body.appendChild(view.build());
});
