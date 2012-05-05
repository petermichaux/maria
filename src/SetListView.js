maria.SetListView = function() {
    maria.ContainerView.apply(this, arguments);
};

maria.SetListView.prototype = new maria.ContainerView();
maria.SetListView.prototype.constructor = maria.SetListView;

maria.SetListView.prototype.getRootEl = function() {
    if (!this._rootEl) {
        this._containerEl = this._rootEl = document.createElement('ul');
        var childViews = this.childNodes;
        for (var i = 0, ilen = childViews.length; i < ilen; i++) {
            this._containerEl.appendChild(childViews[i].getRootEl());
        }
    }
    return this._rootEl;
};

maria.SetListView.prototype.setModel = function(model) {
    if (this.getModel() !== model) {
        maria.ContainerView.prototype.setModel.call(this, model);

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

maria.SetListView.prototype.createChildView = function(model) {
    return new maria.ContainerView(model);
};

maria.SetListView.prototype.getModelActions = function() {
    return {
        'add': 'handleAdd',
        'delete': 'handleDelete'
    };
};

maria.SetListView.prototype.handleAdd = function(evt) {
    var childModels = evt.relatedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

maria.SetListView.prototype.handleDelete = function(evt) {
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
