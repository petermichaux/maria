maria.SetListView = function() {
    maria.ElementView.apply(this, arguments);
};

maria.SetListView.prototype = new maria.ElementView();
maria.SetListView.prototype.constructor = maria.SetListView;

maria.SetListView.prototype.getRootEl = function() {
    if (!this._rootEl) {
        this._containerEl = this._rootEl = document.createElement('ul');

        this.childNodes.forEach(function(view) {
            this._containerEl.appendChild(view.getRootEl());
        }, this);
    }
    return this._rootEl;
};

maria.SetListView.prototype.setModel = function(model) {
    if (this.getModel() !== model) {
        maria.ElementView.prototype.setModel.call(this, model);

        // TODO O(n^2)
        this.childNodes.slice(0).forEach(this.removeChild, this);

        this.getModel().map(function(todoModel) {
            return this.prepChild(todoModel);
        }, this).forEach(this.appendChild, this);
    }
};

maria.SetListView.prototype.prepChild = function(todoModel) {
    return new maria.ElementView(todoModel);
};

maria.SetListView.prototype.getModelEventMap = function() {
    return {
        'add': 'handleAdd',
        'delete': 'handleDelete'
    };
};

maria.SetListView.prototype.handleAdd = function(evt) {
    evt.relatedTargets.forEach(function(todoModel) {
        var todoView = this.prepChild(todoModel);
        this.appendChild(todoView);
    }, this);
};

maria.SetListView.prototype.handleDelete = function(evt) {
    // TODO efficiently
    evt.relatedTargets.forEach(function(todoModel) {
        var node = this.firstChild;
        while (node) {
            if (node.getModel() === todoModel) {
                this.removeChild(node);
            }
            node = node.nextSibling;
        }
    }, this);
};

