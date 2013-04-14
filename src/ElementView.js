/**

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
    checkit.TodoView.prototype = maria.create(maria.ElementView.prototype);
    checkit.TodoView.prototype.constructor = checkit.TodoView;
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
    checkit.TodoView.prototype.buildData = function() {
        var model = this.getModel();
        var content = model.getContent();
        this.find('.todo-content').innerHTML = checkit.escapeHTML(content);
        this.find('.check').checked = model.isDone();
        aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.find('.todo'), 'done');
    };
    checkit.TodoView.prototype.update = function() {
        this.buildData();
    };
    checkit.TodoView.prototype.showEdit = function() {
        var input = this.find('.todo-input');
        input.value = this.getModel().getContent();
        aristocrat.addClass(this.find('.todo'), 'editing');
        input.select();
    };
    checkit.TodoView.prototype.showDisplay = function() {
        aristocrat.removeClass(this.find('.todo'), 'editing');
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

@constructor

@param {maria.Model} [model]

@param {maria.Controller} [controller]

@param {Document} [document]

@extends maria.View

*/
maria.ElementView = function(model, controller, doc) {
    maria.View.call(this, model, controller);
    this.setDocument(doc);
};

maria.ElementView.prototype = maria.create(maria.View.prototype);
maria.ElementView.prototype.constructor = maria.ElementView;

/**

Returns the web page document for the view. This document
is the one used to create elements to be added to the page,
for example.

@return {Document} The document object.

*/
maria.ElementView.prototype.getDocument = function() {
    return this._doc || document;
};

/**

Set the web page document for the view. This document
is the one used to create elements to be added to the page,
for example.

*/
maria.ElementView.prototype.setDocument = function(doc) {
    this._doc = doc;
    var childViews = this.childNodes;
    for (var i = 0, ilen = childViews.length; i < ilen; i++) {
        childViews[i].setDocument(doc);
    }
};

/**

Returns the template for this view used during the build process.

@return {string} The template HTML string.

*/
maria.ElementView.prototype.getTemplate = function() {
    return '<div></div>';
};

/**

The UI actions object maps a UI action like a click
on a button with a handler method name. By default,
the handler will be called on the controller of the view.

@return {Object} The UI actions map.

*/
maria.ElementView.prototype.getUIActions = function() {
    return {};
};

/**

Builds the root DOM element for the view from the view's template
returned by `getTemplate`, attaches event handlers to the root
and its descendents as specified by the UI actions map returned
by `getUIActions`, calls the `buildData` method to allow model
values to be inserted into the root DOM element and its descendents,
and calls `buildChildViews`. This construction of the root DOM element
is lazy and only done when this method is called.

@return {Element} The root DOM Element of the view.

*/
maria.ElementView.prototype.build = function() {
    if (!this._rootEl) {
        this.buildTemplate();
        this.buildUIActions();
        this.buildData();
        this.buildChildViews();
    }
    return this._rootEl;
};

/**

Parses the HTML template string returned by `getTemplate` to create a
`DocumentFragment`. The first child of that `DocumentFragment` is set
as the root element of this view. All other sibling elements of the
`DocumentFragment` are discarded.

*/
maria.ElementView.prototype.buildTemplate = function() {
    // parseHTML returns a DocumentFragment so take firstChild as the rootEl
    this._rootEl = arbutus.parseHTML(this.getTemplate(), this.getDocument()).firstChild;
};

(function() {
    var actionRegExp = /^(\S+)\s*(.*)$/;

/**

Attaches event handlers to the root and its descendents as specified
by the UI actions map returned by `getUIActions`.

*/
    maria.ElementView.prototype.buildUIActions = function() {
        var uiActions = this.getUIActions();
        for (var key in uiActions) {
            if (Object.prototype.hasOwnProperty.call(uiActions, key)) {
                var matches = key.match(actionRegExp),
                    eventType = matches[1],
                    selector = matches[2],
                    methodName = uiActions[key],
                    elements = this.findAll(selector, this._rootEl);
                for (var i = 0, ilen = elements.length; i < ilen; i++) {
                    maria.on(elements[i], eventType, this, methodName);
                }
            }
        }
    };

}());

/**

Does nothing by default. To be overridden by subclasses.

The intended use of this method is to populate the built root DOM element
and its descendents with model data.

*/
maria.ElementView.prototype.buildData = function() {
    // to be overridden by concrete ElementView subclasses
};

/*

Used as part of the initial building of the view. If child views have
been added to the view, then these children also built and appened
to the element returned by `getContainerEl`.

*/
maria.ElementView.prototype.buildChildViews = function() {
    var childViews = this.childNodes;
    for (var i = 0, ilen = childViews.length; i < ilen; i++) {
        this.getContainerEl().appendChild(childViews[i].build());
    }
};

/**

See `buildChildViews` for more details.

@return {Element} The DOM Element to which child view's should be attached.

*/
maria.ElementView.prototype.getContainerEl = function() {
    return this.build();
};

/**

Add a new child view before an existing child view. If the `oldChild`
parameter is not supplied then the `newChild` is appened as the last child.

@param {maria.ElementView} newChild The child to be inserted.

@param {maria.ElementView} oldChild The child to insert before.

*/
maria.ElementView.prototype.insertBefore = function(newChild, oldChild) {
    maria.View.prototype.insertBefore.call(this, newChild, oldChild);
    if (this._rootEl) {
        this.getContainerEl().insertBefore(newChild.build(), oldChild ? oldChild.build() : null);
    }
};

/**

Remove an existing child view.

@param {maria.ElementView} oldChild The child to be removed.

*/
maria.ElementView.prototype.removeChild = function(oldChild) {
    maria.View.prototype.removeChild.call(this, oldChild);
    if (this._rootEl) {
        this.getContainerEl().removeChild(oldChild.build());
    }
};

/**

Find the first element in this view that matches the CSS `selector`. The
view's root element can be the result.

By default Maria uses the Grail library as its DOM query engine. This is
to support older browsers that do not have `querySelector`. The Grail
engine only a limited set of simple selectors.

    .class
    tag
    tag.class
    #id

If your application only needs to work in newer browsers you can create
a Maria plugin to use `querySelector` but ensure the root element will
be returned if it matches `selector`.

If your application needs to work in older browsers but you need more
complex CSS `selector` strings then you can create a Maria plugin
to use some libray other than Grail.

@param {string} selector A CSS selector.

@return {Element} The first DOM element matching `selector`.

*/
maria.ElementView.prototype.find = function(selector) {
    return grail.find(selector, this.build());
};

/**

Find all the elements in this view that matches the CSS `selector`. The
view's root element can be in the result set.

See `find` for more details.

@param {string} selector A CSS selector.

@return {Array} An array of the DOM elements matching `selector`.

*/
maria.ElementView.prototype.findAll = function(selector) {
    return grail.findAll(selector, this.build());
};
