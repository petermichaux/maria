/**

@property maria.ElementView.subclass

@description

A function that makes subclassing maria.ElementView more compact.

The following example creates a checkit.TodoView constructor function
equivalent to the more verbose example shown in the documentation
for maria.ElementView.

    maria.ElementView.subclass(checkit, 'TodoView', {
        uiActions: {
            'click     .check'       : 'onClickCheck'     ,
            'dblclick  .todo-content': 'onDblclickDisplay',
            'keyup     .todo-input'  : 'onKeyupInput'     ,
            'keypress  .todo-input'  : 'onKeypressInput'  ,
            'blur      .todo-input'  : 'onBlurInput'
        },
        properties: {
            buildData: function() {
                var model = this.getModel();
                var content = model.getContent();
                this.find('.todo-content').innerHTML =
                    content.replace('&', '&amp;').replace('<', '&lt;');
                this.find('.check').checked = model.isDone();
                aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.find('.todo'), 'done');
            },
            update: function() {
                this.buildData();
            },
            showEdit: function() {
                var input = this.find('.todo-input');
                input.value = this.getModel().getContent();
                aristocrat.addClass(this.find('.todo'), 'editing');
                input.select();
            },
            showDisplay: function() {
                aristocrat.removeClass(this.find('.todo'), 'editing');
            },
            getInputValue: function() {
                return this.find('.todo-input').value;
            },
            showToolTip: function() {
                this.find('.ui-tooltip-top').style.display = 'block';
            },
            hideToolTip: function() {
                this.find('.ui-tooltip-top').style.display = 'none';
            }
        }
    });

This subclassing function implements options following the
"convention over configuration" philosophy. The checkit.TodoView will,
by convention, use the checkit.TodoModel, checkit.TodoController
and checkit.TodoTemplate objects. All of these can be configured
explicitely if these conventions do not match your view's needs.

    maria.ElementView.subclass(checkit, 'TodoView', {
        modelConstructor     : checkit.TodoModel     ,
        controllerConstructor: checkit.TodoController,
        template             : checkit.TodoTemplate  ,
        uiActions: {
        ...

Alternately you can use late binding by supplying string names of
objects in the application's namespace object (i.e. the checkit object
in this example).

maria.ElementView.subclass(checkit, 'TodoView', {
    modelConstructorName     : 'TodoModel'     ,
    controllerConstructorName: 'TodoController',
    templateName             : 'TodoTemplate'  ,
    uiActions: {
    ...

*/
maria.ElementView.subclass = function(namespace, name, options) {
    options = options || {};
    var template = options.template;
    var templateName = options.templateName || name.replace(/(View|)$/, 'Template');
    var uiActions = options.uiActions;
    var properties = options.properties || (options.properties = {});
    if (!Object.prototype.hasOwnProperty.call(properties, 'getTemplate')) {
        if (template) {
            properties.getTemplate = function() {
                return template;
            };
        }
        else if (templateName) {
            properties.getTemplate = function() {
                return namespace[templateName];
            };
        }
    }
    if (uiActions) {
        if (!Object.prototype.hasOwnProperty.call(properties, 'getUIActions')) {
            properties.getUIActions = function() {
                return uiActions;
            };
        }
        for (var key in uiActions) {
            if (Object.prototype.hasOwnProperty.call(uiActions, key)) {
                var methodName = uiActions[key];
                if (!Object.prototype.hasOwnProperty.call(properties, methodName)) {
                    (function(methodName) {
                        properties[methodName] = function(evt) {
                            this.getController()[methodName](evt);
                        };
                    }(methodName));
                }
            }
        }
    }
    maria.View.subclass.call(this, namespace, name, options);
};
