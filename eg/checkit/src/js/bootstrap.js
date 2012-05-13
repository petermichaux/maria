maria.addEventListener(window, 'load', function() {
    var loading = document.getElementById('loading');
    loading.parentNode.removeChild(loading);

    var app = new checkit.TodosAppView();
    document.body.appendChild(app.getRootEl());
    app.focus();
});
