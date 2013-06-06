/**

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
    checkit.TodosListView.prototype = maria.create(maria.SetView.prototype);
    checkit.TodosListView.prototype.constructor = checkit.TodosListView;
    checkit.TodosListView.prototype.getTemplate = function() {
        return checkit.TodosListTemplate;
    };
    checkit.TodosListView.prototype.createChildView = function(todoModel) {
        return new checkit.TodoView(todoModel);
    };

@constructor

@param {maria.Model} [model]

@param {maria.Controller} [controller]

@param {Document} [document]

@extends maria.ElementView

*/
maria.SetView = function() {
    maria.ElementView.apply(this, arguments);
};

/**

@property maria.SetView.superConstructor

*/
maria.SetView.superConstructor = maria.ElementView;

maria.SetView.prototype = maria.create(maria.ElementView.prototype);
maria.SetView.prototype.constructor = maria.SetView;

/**

The model of the view is a `maria.SetModel`. A new view will be created
for each model in that set model and the view will be appended as a child
view of this set view.

@override

*/
maria.SetView.prototype.buildChildViews = function() {
    var childModels = this.getModel().toArray();
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

/**

Creates a child view for a model. To be overridden by subclasses.

@param {maria.Model} model The model for the child view.

*/
maria.SetView.prototype.createChildView = function(model) {
    return new maria.ElementView(model);
};

/**

The handler for `change` events on this view's set model object.

@param {Object} event The event object.

@override

*/
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


/**

When a `change` event is fired on this view's set model because
some models were added to the set model, this method
will create child views and append them as children of this set view.

@param {Object} event The event object.

*/
maria.SetView.prototype.handleAdd = function(evt) {
    var childModels = evt.addedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

/**

When a `change` event is fired on this view's set model because
some models were deleted from the set model, this method
will find, remove, and destroy the corresponding child views
of this set view.

@param {Object} event The event object.

*/
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
