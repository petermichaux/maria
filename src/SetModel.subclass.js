/**

A function that makes subclassing maria.SetModel more compact.

The following example creates a checkit.TodosModel constructor function
equivalent to the more verbose example shown in the documentation
for maria.SetModel.

    maria.SetModel.subclass(checkit, 'TodosModel', {
        properties: {
            isAllDone: function() {
                return (this.size > 0) &&
                       this.every(function(todo) {
                           return todo.isDone();
                       });
            },
            isAllUndone: function() {
                return this.every(function(todo) {
                           return !todo.isDone();
                       });
            },
            markAllDone: function() {
                this.forEach(function(todo) {
                    todo.setDone(true);
                });
            },
            markAllUndone: function() {
                this.forEach(function(todo) {
                    todo.setDone(false);
                });
            },
            deleteDone: function() {
                var doneTodos = [];
                this.forEach(function(todo) {
                    if (todo.isDone()) {
                        doneTodos.push(todo);
                    }
                });
                this['delete'].apply(this, doneTodos);
            }
        }
    });

Creating a set from JSON is easy. For example,

    var app = {};

    maria.Model.subclass(app, 'PersonModel', {
        attributes: {
            name: {
                type: 'string'
            }
        }
    });

    maria.SetModel.subclass(app, 'PeopleSetModel', {
        elementConstructorName: 'PersonModel'
    });

    var people = app.PeopleSetModel.fromJSON([
        {name: 'Sgt Baker'},
        {name: 'Mr Krinkle'}
    ]);

You can get a data object suitable for serializing as a JSON string with

    people.toJSON();

*/
maria.SetModel.subclass = function(namespace, name, options) {
    options = options || {};
    if (Object.prototype.hasOwnProperty.call(options, 'elementConstructor') ||
        Object.prototype.hasOwnProperty.call(options, 'elementConstructorName')) {
        var elementConstructor = options.elementConstructor;
        var elementConstructorName = options.elementConstructorName;
        var properties = options.properties || (options.properties = {});
        if (!Object.prototype.hasOwnProperty.call(properties, 'getDefaultElementConstructor')) {
            properties.getDefaultElementConstructor = function() {
                /* DEBUG BEGIN */
                if ((!elementConstructor) &&
                    (!Object.prototype.hasOwnProperty.call(namespace, elementConstructorName))) {
                    console.error('Could not find element class named "' + elementConstructorName + '".');    
                }
                /* DEBUG END */
                return elementConstructor || namespace[elementConstructorName];
            };
        }
    }

    maria.Model.subclass.call(this, namespace, name, options);

    if (!Object.prototype.hasOwnProperty(namespace[name], 'fromJSON')) {
        namespace[name].fromJSON = function(json) {
            return this.superConstructor.fromJSON.call(this, json);
        };
    }

};
