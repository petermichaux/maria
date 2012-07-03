/**

@property maria.SetView

@parameter model {Object} Optional

@parameter controller {Object} Optional

@parameter document {Document} Optional

@description

A constructor function to create new set view objects.

    var setView = new maria.SetView();

maria.SetView inherits from maria.ElementView and the documentation of
maria.ElementView will tell you most of what you need to know when
working with a maria.SetView.

A maria.SetView is intended to be a view for a maria.SetModel. The set
view will take care child views when elements are added or deleted from
the set model.

When an element is added to the set, the set view need to know what
kind of view to make. Your application will redefine or likely override
the set view's createChildView method.

    maria.SetView.prototype.createChildView = function(model) {
        return new maria.ElementView(model);
    };

A particularly useful pattern is using maria.SetView as the
"superclass" of your application's set views. The following example
shows how this can be done at a low level for a to-do application. See
maria.SetView.subclass for a more compact way to accomplish the same.

    checkit.TodosListView = function() {
        maria.SetView.apply(this, arguments);
    };
    checkit.TodosListView.prototype = new maria.SetView();
    checkit.TodosListView.prototype.constructor = checkit.TodosListView;
    checkit.TodosListView.prototype.getTemplate = function() {
        return checkit.TodosListTemplate;
    };
    checkit.TodosListView.prototype.createChildView = function(todoModel) {
        return new checkit.TodoView(todoModel);
    };

*/
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
            var childView = childViews[i];
            this.removeChild(childView);
            childView.destroy();
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

maria.SetView.prototype.update = function(evt) {
    // Don't update for bubbling events.
    if (evt.target === this.getModel()) {
        if (evt.addedTargets && evt.addedTargets.length) {
            this.handleAdd(evt);
        }
        if (evt.deletedTargets && evt.deletedTargets.length) {
            this.handleDelete(evt);
        }
    }
};

maria.SetView.prototype.handleAdd = function(evt) {
    var childModels = evt.addedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

maria.SetView.prototype.handleDelete = function(evt) {
    var childModels = evt.deletedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        var childModel = childModels[i];
        var childViews = this.childNodes;
        for (var j = 0, jlen = childViews.length; j < jlen; j++) {
            var childView = childViews[j];
            if (childView.getModel() === childModel) {
                this.removeChild(childView);
                childView.destroy();
                break;
            }
        }
    }
};
