/**

A function that makes subclassing `maria.ElementView` more compact.

The following example creates a `checkit.TodoView` constructor function
equivalent to the more verbose example shown in the documentation
for `maria.ElementView`.

    maria.ElementView.subclass(checkit, 'TodoView', {
        uiActions: {
            'click     .check'       : 'onClickCheck'     ,
            'dblclick  .todo-content': 'onDblclickDisplay',
            'keyup     .todo-input'  : 'onKeyupInput'     ,
            'keypress  .todo-input'  : 'onKeypressInput'  ,
            'blur      .todo-input'  : 'onBlurInput'
        },
        properties: {
            buildData: function () {
                var model = this.getModel();
                var content = model.getContent();
                this.find('.todo-content').innerHTML = checkit.escapeHTML(content);
                this.find('.check').checked = model.isDone();
                aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.find('.todo'), 'done');
            },
            update: function () {
                this.buildData();
            },
            showEdit: function () {
                var input = this.find('.todo-input');
                input.value = this.getModel().getContent();
                aristocrat.addClass(this.find('.todo'), 'editing');
                input.select();
            },
            showDisplay: function () {
                aristocrat.removeClass(this.find('.todo'), 'editing');
            },
            getInputValue: function () {
                return this.find('.todo-input').value;
            },
            showToolTip: function () {
                this.find('.ui-tooltip-top').style.display = 'block';
            },
            hideToolTip: function () {
                this.find('.ui-tooltip-top').style.display = 'none';
            }
        }
    });

This subclassing function implements options following the
"convention over configuration" philosophy. The `checkit.TodoView` will,
by convention, use the `checkit.TodoController`
and `checkit.TodoTemplate` objects. All of these can be configured
explicitly if these conventions do not match your view's needs.

    maria.ElementView.subclass(checkit, 'TodoView', {
        controllerConstructor: checkit.TodoController,
        template             : checkit.TodoTemplate  ,
        uiActions: {
        ...

Alternately you can use late binding by supplying string names of
objects in the application's namespace object (i.e. the checkit object
in this example).

    maria.ElementView.subclass(checkit, 'TodoView', {
        controllerConstructorName: 'TodoController',
        templateName             : 'TodoTemplate'  ,
        uiActions: {
        ...

You can augment `uiActions` in your subclass by specifying the declarative
`moreUIActions` property (instead of using `uiActions`.)

    checkit.TodoView.subclass(checkit, 'ReminderView', {
        moreUIActions: {
            'click .reminder': 'onClickReminder'
        },
        properties: {
            showReminder: function () {
                this.find('.todo-reminder').style.display = 'block';
            },
            hideReminder: function () {
                this.find('.todo-reminder').style.display = 'none';
            }
        }
    });

The `ReminderView` will inherit the properties defined in `uiActions` from
`TodoView` and augment it with `moreUIActions`. The subclassing function
will generate the equivalent of the following function.

    checkit.TodoView.prototype.getUIActions = function () {
        var uiActions = checkit.TodoView.superConstructor.prototype.getUIActions.call(this);
        uiActions['click .reminder'] = 'onClickReminder';
        return uiActions;
    };
*/
maria.ElementView.subclass = function (namespace, name, options) {
    options = options || {};
    var template = options.template;
    var templateName = options.templateName || name.replace(/(View|)$/, 'Template');
    var uiActions = options.uiActions;
    var moreUIActions = options.moreUIActions;
    var properties = options.properties || (options.properties = {});
    if (!Object.prototype.hasOwnProperty.call(properties, 'getTemplate')) {
        if (template) {
            properties.getTemplate = function () {
                return template;
            };
        }
        else if (templateName) {
            properties.getTemplate = function () {
                /* DEBUG BEGIN */
                if (!Object.prototype.hasOwnProperty.call(namespace, templateName)) {
                    console.error('Could not find template named "' + templateName + '".');
                }
                /* DEBUG END */
                return namespace[templateName];
            };
        }
    }
    /* DEBUG BEGIN */
    if (uiActions && moreUIActions) {
        console.warn('maria.ElementView.subclass: uiActions and moreUIActions are both defined in "' + name + '". uiActions will be used and moreUIactions will be ignored.');
    }
    /* DEBUG END */
    if (uiActions) {
        if (!Object.prototype.hasOwnProperty.call(properties, 'getUIActions')) {
            properties.getUIActions = function () {
                return uiActions;
            };
        }
    }
    else if (moreUIActions) {
        if (!Object.prototype.hasOwnProperty.call(properties, 'getUIActions')) {
            properties.getUIActions = function () {
                var uiActions = namespace[name].superConstructor.prototype.getUIActions.call(this);
                for (var key in moreUIActions) {
                    if (Object.prototype.hasOwnProperty.call(moreUIActions, key)) {
                        uiActions[key] = moreUIActions[key];
                    }
                }
                return uiActions;
            };
        }
        uiActions = moreUIActions;
    }
    if (uiActions) {
        for (var key in uiActions) {
            if (Object.prototype.hasOwnProperty.call(uiActions, key)) {
                var methodName = uiActions[key];
                if ((!Object.prototype.hasOwnProperty.call(properties, methodName)) &&
                    (!(methodName in this.prototype))) {
                    (function (methodName) {
                        properties[methodName] = function (evt) {
                            this.getController()[methodName](evt);
                        };
                    }(methodName));
                }
            }
        }
    }
    maria.View.subclass.call(this, namespace, name, options);
};
