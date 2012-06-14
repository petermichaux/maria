/**

@property maria.Controller

@description

A constructor function to create new controller objects.

Controller objects are usually created lazily on demand by a view
object but you can create one explicitly. You might want to do this if
you want to exercise the strategy pattern and dynamically change a
view's controller.

    var controller = new maria.Controller();

A controller object has a view object. The view will automatically
sets itself as the controller's view when the view creates
the controller or when view.setController is called with the
controller. You can set the view object explicitely but you may
never have a need to do this.

    var view = new maria.View();
    controller.setView(view);

You can get the controller's view object when needed and you will do
this frequently in the methods of the controller.

    controller.getView();

A controller object also has a model object. A controller-view pair
will usually have the same model object and the view object will keep
the controller object's model in sync with the view object's model
object. The model is usually set automatically by the view when the
view creates the controller or when view.setController is called with
the controller. You can set the model object explicitely but you
many never have a need to do this.

    var model = new maria.Model();
    controller.setModel(model);

You can get the controller's model object when needed and you will do
this frequently in the methods of the controller.

    controller.getModel();

A particularly useful pattern is using maria.Controller as the
"superclass" of your application's controller. The following
example shows how this can be done at a low level for a to-do
application. See maria.Controller.subclass for a more compact way
to accomplish the same.

    checkit.TodoController = function() {
        maria.Controller.apply(this, arguments);
    };
    checkit.TodoController.prototype = new maria.Controller();
    checkit.TodoController.prototype.constructor = checkit.TodoController;
    checkit.TodoController.prototype.onClickCheck = function() {
        this.getModel().toggleDone();
    };
    checkit.TodoController.prototype.onDblclickDisplay = function() {
        this.getView().showEdit();
    };
    checkit.TodoController.prototype.onKeyupInput = function() {
        var view = this.getView();
        if (/\S/.test(view.getInputValue())) {
            view.showToolTip();
        } else {
            view.hideToolTip();
        }
    };
    checkit.TodoController.prototype.onKeypressInput = function(evt) {
        if (evt.keyCode === 13) {
            this.onBlurInput();
        }
    };
    checkit.TodoController.prototype.onBlurInput = function() {
        var view = this.getView();
        var value = view.getInputValue();
        view.hideToolTip();
        view.showDisplay();
        if (!/^\s*$/.test(value)) {
            this.getModel().setContent(value);
        }
    };

The above TodoController example does not have an "initialize" method;
however, if some special initialization is requried, maria.Controller
will automatically call your "initialize" method.

    checkit.TodoController.prototype.initialize = function() {
        alert('Another to-do controller has been created.');
    };

*/
maria.Controller = function() {
    this.initialize();
};

maria.Controller.prototype.initialize = function() {};

maria.Controller.prototype.destroy = function() {
    this._model = null;
    if (this._view) {
        this._view.setController(null);
        this._view = null;
    }
};

maria.Controller.prototype.getModel = function() {
    return this._model;
};

maria.Controller.prototype.setModel = function(model) {
    this._model = model;
};

maria.Controller.prototype.getView = function() {
    return this._view;
};

maria.Controller.prototype.setView = function(view) {
    this._view = view;
};
