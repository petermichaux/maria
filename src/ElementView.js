/**

@property maria.ElementView

@parameter model {Object} Optional

@parameter controller {Object} Optional

@parameter document {Document} Optional

@description

A constructor function to create new element view objects.

    var elementView = new maria.ElementView();

This constructor function takes three optional arguments.

    var model = new maria.Model();
    var controller = new maria.Controller();
    var myFrameDoc = window.frames['myFrame'].document;
    var elementView =
        new maria.ElementView(model, controller, myFrameDoc);

The null or undefined value can be passed for any of these three
parameters to skip setting it.

The purpose of the third document parameter is to allow the creation
of element views in one window that will be shown in another window.
At least some older browsers do not allow a DOM element created with
one document object to be appended to another document object.

An element view is a view (inheriting from maria.View) and so has
a model and controller. See maria.View for more documentation about
setting and getting the model and controller objects.

What makes maria.ElementView different from the more abstract
maria.View is that an element view has the concept of a "root element"
which is the main DOM element that acts as a container for all the
other DOM elements that are part of the element view.

The DOM is built using the getTemplate method which should return a
fragment of HTML for a single DOM element and its children. By default
the template is just an empty div element. You can redefine or override
this to suit your needs.

    maria.ElementView.prototype.getTemplate = function() {
        return '<div>' +
                   '<span class="greeting">hello</span>, ' +
                   '<span class="name">world</span>' +
               '</div>';
    };

When an element view is created and its HTML template is rendered as
a DOM element, the view will automatically start listening to the DOM
element or its children for the events specified in the map returned
by the getUIActions method. This map is empty by default but you can
redefine or override as necessary and supply the necessary handler
functions which usually delegate to the controller.

    maria.ElementView.prototype.getUIActions = function() {
        return {
            'mouseover .greeting': 'onMouseoverGreeting',
            'click .name'        : 'onClickName'
        };
    };

    maria.ElementView.prototype.onMouseoverGreeting = function(evt) {
        this.getController().onMouseoverGreeting(evt);
    };

    maria.ElementView.prototype.onClickName = function(evt) {
        this.getController().onClickName(evt);
    };

Only a few simple CSS selectors are allowed in the keys of the UI
action map. An id can be used like "#alpha" but this is not
recommended. A class name like ".greeting", a tag name like "div", or
a combination of tag name and class name like "div.greeting" are
acceptable. In almost all cases, a single class name is sufficient and
recommended as the best practice. (If you need more complex selectors
you can use a different query library to replace the Grail library
used by default in Maria.)

You can find an element or multiple elements in a view using the
element view's find and findAll methods.

    elementView.find('.name');   // returns a DOM element
    elementView.findAll('span'); // returns an array

Because maria.View objects are composite views, so are
maria.ElementView objects. This means that sub-element-view objects can
be added to an element view. By default the sub-element-view object's
root DOM element will be added to the parent element view's root
DOM element. You can change the element to which they are added by
redefining or overridding the getContainerEl function.

    maria.ElementView.prototype.getContainerEl = function() {
        return this.find('.name');
    };

A particularly useful pattern is using maria.ElementView as the
"superclass" of your application's element views. The following example
shows how this can be done at a low level for a to-do application. See
maria.ElementView.subclass for a much more compact way to accomplish
the same.

    checkit.TodoView = function() {
        maria.ElementView.apply(this, arguments);
    };
    checkit.TodoView.prototype = new maria.ElementView();
    checkit.TodoView.prototype.constructor = checkit.TodoView;
    checkit.TodoView.prototype.initialize = function() {
        if (!this.getModel()) {
            this.setModel(this.getDefaultModel());
        }
    };
    checkit.TodoView.prototype.getDefaultModelConstructor = function() {
        return checkit.TodoModel;
    };
    checkit.TodoView.prototype.getDefaultControllerConstructor = function() {
        return checkit.TodoController;
    };
    checkit.TodoView.prototype.getTemplate = function() {
        return checkit.TodoTemplate;
    };
    checkit.TodoView.prototype.getUIActions = function() {
        return {
            'click     .check'       : 'onClickCheck'     ,
            'dblclick  .todo-content': 'onDblclickDisplay',
            'keyup     .todo-input'  : 'onKeyupInput'     ,
            'keypress  .todo-input'  : 'onKeypressInput'  ,
            'blur      .todo-input'  : 'onBlurInput'
        };
    };
    checkit.TodoView.prototype.onClickCheck = function(evt) {
        this.getController().onClickCheck(evt);
    };
    checkit.TodoView.prototype.onDblclickDisplay = function(evt) {
        this.getController().onDblclickDisplay(evt);
    };
    checkit.TodoView.prototype.onKeyupInput = function(evt) {
        this.getController().onKeyupInput(evt);
    };
    checkit.TodoView.prototype.onKeypressInput = function(evt) {
        this.getController().onKeypressInput(evt);
    };
    checkit.TodoView.prototype.onBlurInput = function(evt) {
        this.getController().onBlurInput(evt);
    };
    checkit.TodoView.prototype.update = function() {
        var model = this.getModel();
        var content = model.getContent();
        this.find('.todo-content').innerHTML =
            content.replace('&', '&amp;').replace('<', '&lt;');
        this.find('.check').checked = model.isDone();
        aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.getRootEl(), 'done');
    };
    checkit.TodoView.prototype.showEdit = function() {
        var input = this.find('.todo-input');
        input.value = this.getModel().getContent();
        aristocrat.addClass(this.getRootEl(), 'editing');
        input.select();
    };
    checkit.TodoView.prototype.showDisplay = function() {
        aristocrat.removeClass(this.getRootEl(), 'editing');
    };
    checkit.TodoView.prototype.getInputValue = function() {
        return this.find('.todo-input').value;
    };
    checkit.TodoView.prototype.showToolTip = function() {
        this.find('.ui-tooltip-top').style.display = 'block';
    };
    checkit.TodoView.prototype.hideToolTip = function() {
        this.find('.ui-tooltip-top').style.display = 'none';
    };

*/
maria.ElementView = function(model, controller, doc) {
    this._doc = doc || document;
    maria.View.call(this, model, controller);
};

maria.ElementView.prototype = new maria.View();
maria.ElementView.prototype.constructor = maria.ElementView;

maria.ElementView.prototype.getDocument = function() {
    return this._doc;
};

maria.ElementView.prototype.getTemplate = function() {
    return '<div></div>';
};

maria.ElementView.prototype.getUIActions = function() {
    return {};
};

(function() {
    var actionRegExp = /^(\S+)\s*(.*)$/;

    maria.ElementView.prototype.getRootEl = function() {
        if (!this._rootEl) {
            // parseHTML returns a DocumentFragment so take firstChild as the rootEl
            var rootEl = this._rootEl = maria.parseHTML(this.getTemplate(), this._doc).firstChild;

            var uiActions = this.getUIActions();
            for (var key in uiActions) {
                if (Object.prototype.hasOwnProperty.call(uiActions, key)) {
                    var matches = key.match(actionRegExp),
                        eventType = matches[1],
                        selector = matches[2],
                        methodName = uiActions[key],
                        elements = maria.findAll(selector, this._rootEl);
                    for (var i = 0, ilen = elements.length; i < ilen; i++) {
                        evento.addEventListener(elements[i], eventType, this, methodName);
                    }
                }
            }

            var childViews = this.childNodes;
            for (var i = 0, ilen = childViews.length; i < ilen; i++) {
                this.getContainerEl().appendChild(childViews[i].getRootEl());
            }

            this.update();
        }
        return this._rootEl;
    };

}());

maria.ElementView.prototype.getContainerEl = function() {
    return this.getRootEl();
};

maria.ElementView.prototype.insertBefore = function(newChild, oldChild) {
    maria.View.prototype.insertBefore.call(this, newChild, oldChild);
    if (this._rootEl) {
        this.getContainerEl().insertBefore(newChild.getRootEl(), oldChild ? oldChild.getRootEl() : null);
    }
};

maria.ElementView.prototype.removeChild = function(oldChild) {
    maria.View.prototype.removeChild.call(this, oldChild);
    if (this._rootEl) {
        this.getContainerEl().removeChild(oldChild.getRootEl());
    }
};

maria.ElementView.prototype.find = function(selector) {
    return maria.find(selector, this.getRootEl());
};

maria.ElementView.prototype.findAll = function(selector) {
    return maria.findAll(selector, this.getRootEl());
};
