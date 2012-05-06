maria.SetView = function() {
    maria.ElementView.apply(this, arguments);
};

maria.SetView.prototype = new maria.ElementView();
maria.SetView.prototype.constructor = maria.SetView;

maria.SetView.prototype.setModel = function(model) {
    if (this.getModel() !== model) {
        maria.ElementView.prototype.setModel.call(this, model);

        var childViews = this.childNodes.slice(0);
        for (var i = 0, ilen = childViews.length; i < ilen; i++) {
            this.removeChild(childViews[i]);
        }

        var childModels = this.getModel().toArray();
        for (var i = 0, ilen = childModels.length; i < ilen; i++) {
            this.appendChild(this.createChildView(childModels[i]));
        }
    }
};

maria.SetView.prototype.createChildView = function(model) {
    return new maria.ElementView(model);
};

maria.SetView.prototype.getModelActions = function() {
    return {
        'add': 'handleAdd',
        'delete': 'handleDelete'
    };
};

maria.SetView.prototype.handleAdd = function(evt) {
    var childModels = evt.relatedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

maria.SetView.prototype.handleDelete = function(evt) {
    var childModels = evt.relatedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        var childModel = childModels[i];
        var childViews = this.childNodes;
        for (var j = 0, jlen = childViews.length; j < jlen; j++) {
            var childView = childViews[j];
            if (childView.getModel() === childModel) {
                this.removeChild(childView);
                break;
            }
        }
    }
};


maria.SetView.subclass = function(namespace, name, options) {
    options = options || {};
    options.SuperConstructor = options.SuperConstructor || maria.SetView;
    maria.ElementView.subclass(namespace, name, options);
};
