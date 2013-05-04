/**

A constructor function to create new view objects.

    var view = new maria.View();

This constructor function takes two optional arguments.

    var model = new maria.Model();
    var controller = new maria.Controller();
    var view = new maria.View(model, controller);

The null or undefined value can be passed for either of these two
parameters to skip setting it.

A view is has a model. You can get the current model which might
be undefined.

    view.getModel();

You can set the model.

    view.setModel(model);

When a view object's model object is set, the view will, by convention,
observe the model's "change" event. When a "change" event is dispatched
on the model, the view's "update" method will be called.

Your application will redefine or more likely override the update method.

    maria.View.prototype.update = function(evt) {
        alert('the model changed');
    };

If necessary, you can change the events and methods that the view will
observe when the model is set by redefining or overriding the
getModelActions method.

    maria.View.prototype.getModelActions = function() {
        return {
            'squashed': 'onSquashed',
            'squished': 'onSquished'
        };
    };

By overriding the `getModelActions` method, the view will only observe
the model's `change` event if you explicitely list it which is not done
above. If you want to observe the `squashed`, `squished`, **and** `change`
events then you need to write the following.

maria.View.prototype.getModelActions = function() {
    return {
        'change'  : 'update'    ,
        'squashed': 'onSquashed',
        'squished': 'onSquished'
    };
};

When the model is set, if the view had a previous model then the view
will unsubscribe from the events it subscribed to on the prevous model
when the previous model was set.

A view has a controller. You can get the current controller.

    view.getController();

The view's controller is created lazily the first time the
getController method is called. The view's 
getDefaultControllerConstructor method returns the constructor function
to create the controller object and the getDefaultController actually
calls that constructor. Your application may redefine or override
either of these methods.

A view has a destroy method which should be called before your
application looses its last reference to the view.

An view object is a composite view. This means the view can have child
views added and removed. This functionality is provided by the Hijos
library. Briefly,

    var childView1 = new maria.View();
    var childView2 = new maria.View();
    view.appendChild(childView1);
    view.replaceChild(childView2, childView1);
    view.insertBefore(childView1, childView2);
    view.removeChild(childView2);
    view.childNodes;
    view.firstChild;
    view.lastChild;
    childView1.nextSibling;
    childView1.previousSibling;
    childView1.parentNode;

When a view's destroy method executes, it calls each child's destroy
method.

The maria.View constructor is relatively abstract. It is most likely
that your application can use maria.ElementView; however, if you are
creating a new type of view where maria.ElementView is not a good fit,
for example a view that represents part of a bitmap drawing on a canvas
element, then you may want to use maria.View as the "superclass" of
your new view constructor. The following example shows how this can be
done at a low level. See maria.View.subclass for a more compact way to
accomplish the same.

    myapp.MyView = function() {
        maria.View.apply(this, arguments);
    };
    myapp.MyView.prototype = maria.create(maria.View.prototype);
    myapp.MyView.prototype.constructor = myapp.MyView;
    myapp.MyView.prototype.getModelActions = function() {
        return {
            'squashed': 'onSquashed',
            'squished': 'onSquished'
        };
    };
    maria.MyView.prototype.onSquished = function(evt) {
        this.getController().onSquished(evt);
    };
    maria.MyView.prototype.onSquashed = function() {
    this.getController().onSquashed(evt);
    };
    myapp.MyView.prototype.getDefaultControllerConstructor = function() {
        return myapp.MyController;
    };
    myapp.MyView.prototype.anotherMethod = function() {
        alert('another method');
    };

@constructor

@extends maria.Node

@param {maria.Model} [model]

@param {maria.Controller} [controller]

*/
maria.View = function(model, controller) {
    maria.Node.call(this);
    this.setModel(model);
    this.setController(controller);
};

maria.View.prototype = maria.create(maria.Node.prototype);
maria.View.prototype.constructor = maria.View;

/*

Call before your application looses its last reference to this view.

This will unsubcribe this view from its model so that this view
does not become a zombie view.

*/
maria.View.prototype.destroy = function() {
    maria.purge(this);
    this._model = null;
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    maria.Node.prototype.destroy.call(this);
};

/**

By default, a view will observe its model for `change` events. When
a `change` event is dispatched on the model then this `update` method
is the handler. (The "change" and "update" names are inherited directly
from Smalltalk implementations.)

To be overridden by subclasses.

@param {object} event The event object.

*/
maria.View.prototype.update = function() {
    // to be overridden by concrete view subclasses
};

/**

Returns the current model object of this view.

@return {maria.Model} The model object.

*/
maria.View.prototype.getModel = function() {
    return this._model;
};

/**

Set the current model object of this view.

@param {maria.Model} model The model object.

*/
maria.View.prototype.setModel = function(model) {
    this._setModelAndController(model, this._controller);
};

/**

Returns a controller constructor function to be used to create
a controller for this view.

@return {function} The controller constructor function. 

*/
maria.View.prototype.getDefaultControllerConstructor = function() {
    return maria.Controller;
};

/**

Creates a new default controller for this view.

@return {maria.Controller} The controller object.

*/
maria.View.prototype.getDefaultController = function() {
    var constructor = this.getDefaultControllerConstructor();
    return new constructor();
};


/**

If this view has not yet had its controller set then this method
creates a controller and sets it as this view's controller.

@return {maria.Controller} The controller object.

*/
maria.View.prototype.getController = function() {
    if (!this._controller) {
        this.setController(this.getDefaultController());
    }
    return this._controller;
};

/**

Set the current controller for this view.

@param {maria.Controller} The controller object.

*/
maria.View.prototype.setController = function(controller) {
    this._setModelAndController(this._model, controller);
};


/**

When the model is set for this view, the view will automatically
observe the events which are keys of the returned object. The values
for each key is the view's handler method to be called when the corresponding
event is dispatched on the model.

By default, a view will observe the model for `change` events and handle
those events with the view's `update` method.

You can override this method but, beware, doing so can lead to the dark side.

@return {Object} The map of model events and view handers.

*/
maria.View.prototype.getModelActions = function() {
    return {'change': 'update'};
};

maria.View.prototype._setModelAndController = function(model, controller) {
    var type, eventMap;
    if (this._model !== model) {
        if (this._model) {
            eventMap = this._lastModelActions;
            for (type in eventMap) {
                if (Object.prototype.hasOwnProperty.call(eventMap, type)) {
                    maria.off(this._model, type, this, eventMap[type]);
                }
            }
            delete this._lastModelActions;
        }
        if (model) {
            eventMap = this._lastModelActions = this.getModelActions() || {};
            for (type in eventMap) {
                if (Object.prototype.hasOwnProperty.call(eventMap, type)) {
                    maria.on(model, type, this, eventMap[type]);
                }
            }
        }
        this._model = model;
    }
    if ((this._controller !== controller) && this._controller) {
        this._controller.setView(null);
        this._controller.setModel(null);
    }
    if (controller) {
        controller.setView(this);
        controller.setModel(model);
    }
    this._controller = controller;
};
