/**

A constructor function to create new model objects.

    var model = new maria.Model();

The most interesting feature of model objects is that they are event
targets and so can be observed by any event listeners. Other model
objects, view objects, or any other interested objects can observe by
being added as event listeners.

For example, the following view object's "update" method will be called
when a "change" event is dispatched on the model objects.

    var view = {
        update: function (evt) {
            alert('The model changed!');
        }
    };
    maria.on(model, 'change', view, 'update');

The model can dispatch a "change" event on itself when the model
changes.

    model.setContent = function (content) {
        this._content = content;
        model.dispatchEvent({type: 'change'});
    };

If desired, a model can push additional data to its observers by
including that data on the event object.

    model.setContent = function (content) {
        var previousContent = this._content;
        this._content = content;
        model.dispatchEvent({
            type: 'change',
            previousContent: previousContent,
            content: content
        });
    };

An event listener can be removed from a model object.

    maria.off(model, 'change', view, 'update');

A particularly useful pattern is using maria.Model as the "superclass"
of your application's model. The following example shows how this
can be done at a low level for a to-do application.

    checkit.TodoModel = function () {
        maria.Model.apply(this, arguments);
    };
    checkit.TodoModel.superConstructor = maria.Model;
    checkit.TodoModel.prototype = maria.create(maria.Model.prototype);
    checkit.TodoModel.prototype.constructor = checkit.TodoModel;
    checkit.TodoModel.prototype._content = '';
    checkit.TodoModel.prototype._isDone = false;
    checkit.TodoModel.prototype.getContent = function () {
        return this._content;
    };
    checkit.TodoModel.prototype.setContent = function (content) {
        content = checkit.trim('' + content);
        if (this._content !== content) {
            this._content = content;
            this.dispatchEvent({type: 'change'});
        }
    };
    checkit.TodoModel.prototype.isDone = function () {
        return this._isDone;
    };
    checkit.TodoModel.prototype.setDone = function (isDone) {
        isDone = !!isDone;
        if (this._isDone !== isDone) {
            this._isDone = isDone;
            this.dispatchEvent({type: 'change'});
        }
    };
    checkit.TodoModel.prototype.toggleDone = function () {
        this.setDone(!this.isDone());
    };

A shorter way to define the TodoModel uses the define attribute methods.

    checkit.TodoModel = function () {
        maria.Model.apply(this, arguments);
    };
    checkit.TodoModel.superConstructor = maria.Model;
    checkit.TodoModel.prototype = maria.create(maria.Model.prototype);
    checkit.TodoModel.prototype.constructor = checkit.TodoModel;
    maria.mixinStringAttribute(checkit.TodoModel.prototype, 'content', {
        coerce: true,
        trim: true
    });
    maria.mixinBooleanAttribute(checkit.TodoModel.prototype, 'done', {
        coerce: true
    });

See maria.Model.subclass for an even more compact way to accomplish the same.

When a model's "destroy" method is called, a "destroy" event is
dispatched and all event listeners who've been added for this event
type will be notified.

(See evento.EventTarget for advanced information about event bubbling
using "addParentEventTarget" and "removeParentEventTarget".)

@constructor

@extends evento.EventTarget

*/
maria.Model = function () {
    evento.EventTarget.call(this);
};

/**

@property maria.Model.superConstructor

*/
maria.Model.superConstructor = evento.EventTarget;

maria.Model.prototype = maria.create(evento.EventTarget.prototype);
maria.Model.prototype.constructor = maria.Model;

/**

When a model is destroyed, it dispatches a `destroy` event to let
listeners (especially containing `maria.SetModel` objects) that
this particular model is no longer useful/reliable.

*/
maria.Model.prototype.destroy = function () {
    this.dispatchEvent({type: 'destroy'});
};

/**

Calls all methods on the model object that have method name
beginning with "`reset`".

A possible use case for calling this `reset` method is just
before calling the `fromJSON` method. A model that is being recycled
should be reset to clear all properties in case the JSON data
does not have enough data for all of the recycled model's attributes.

*/
maria.Model.prototype.reset = function () {
    for (var p in this) {
        if (/^reset.+/.test(p) && (typeof this[p] === 'function')) {
            this[p]();
        }
    }
};

/**

Calls all methods on the model that end with "`ToJSON`" in order to aggregate
the model's data into an object suitable to be serialized as a JSON string.

@return {object} An object suitable to be serialized to JSON.

*/
maria.Model.prototype.toJSON = function () {
    var m,
        p,
        json = {};
    for (p in this) {
        if ((m = p.match(/^(.+)ToJSON$/)) && (typeof this[p] === 'function')) {
            json[m[1]] = this[p]();
        }
    }
    return json;
};

/**

Set the attributes of a model object from a data object.

Iterate over the data object. For each property that has a matching
model method ending in "`FromJSON`", call that method with the value
in the data object.

@param {object} json The data object.

*/
maria.Model.prototype.fromJSON = function (json) {
    for (var p in json) {
        if (Object.prototype.hasOwnProperty.call(json, p) &&
                (typeof this[p + 'FromJSON'] === 'function')) {
            this[p + 'FromJSON'](json[p]);
        }
    }
};

/**

Create a new model instance and set its attributes from the data object.

@param {object} json The data object.

@return {object} The new model instance.

*/
maria.Model.fromJSON = function (json) {
    var model = new this();
    model.fromJSON(json);
    return model;
};

/**

Create a model attribute and accessor methods on a model object.

For an attribute named `*`, this function will generate a `_*` private
property to hold the attribute's data value as well as `get*`, `guard*`,
`set*`, `reset*`, `*ToJSON`, and `*FromJSON` methods.

The `options` object can contain the following properties.

`default` is the default value to be used for the attribute. Without
specifying this options the default will be JavaScript's `undefined`.

`get` is a method to be used as the getter for the attribute.

`guard` is a method that processes the value sent to the setter method.
The guard can do things like coercing the value or throwing errors if
the value is not acceptable. If this option is not supplied, the default
guard does nothing.

`set` is a method to be used as the setter for the attribute. If not supplied
the setter will call the guard method and if the new value is different
than the previous value for the attribute, it will set the value and
dispatch a change event.

`reset` is a method to reset the attribute. If not supplied, the default
reset method will set the attribute's value back to the default value
and dispatch a change event. The resulting method is named to be used
with the `reset` method of the model to reset all attributes of the model.

`toJSON` is a method that returns a data object suitable for serialization
as a JSON object. This method must be supplied or the default method
overwritten later. The resulting method is named to be
used with the `toJSON` method of the model.

`fromJSON` is a method that accepts a data object and is intended
to set the model's attribute value. This method must be supplied or
the default method overwritten later. The resulting method is named to be
used with the `fromJSON` method of the model.

You are most likely to use `maria.mixinAttribute` on a model prototype
as shown in the `maria.Model` documentation but here is an example using
it on a single model object.

    var m = new maria.Model;
    maria.mixinAttribute(m, 'name', {
        guard: function (value) {
            // coerce any input to string
            return '' + value;
        }
    });
    m.getName();       // undefined
    m.setName('Adam');
    m.getName();       // 'Adam'
    m.resetName();
    m.getName();       // undefined
    m.setName(123);
    m.getName();       // '123' Note this is a string.

@param {object} obj The model object to which an attribute will be added.

@param {string} name The name of the attribute to be added.

@param {object} options The options object. See description for more details.

*/
maria.mixinAttribute = function (obj, name, options) {
    options = options || {};

    var privateName = '_' + name,
        capitalizedName = maria.capitalize(name),
        get = 'get' + capitalizedName,
        guard = 'guard' + capitalizedName,
        set = 'set' + capitalizedName,
        reset = 'reset' + capitalizedName,
        toJSON = name + 'ToJSON',
        fromJSON = name + 'FromJSON',
        dflt = options['default'];

    obj[privateName] = dflt;

    obj[get] = options.get || function () {
        return this[privateName];
    };

    obj[guard] = options.guard || function (value) {
        return value;
    };

    obj[set] = options.set || function (value) {
        value = this[guard](value);
        if (this[privateName] !== value) {
            this[privateName] = value;
            this.dispatchEvent({type: 'change'});
        }
    };

    obj[reset] = options.reset || function () {
        if (this[privateName] !== dflt) {
            this[privateName] = dflt;
            this.dispatchEvent({type: 'change'});
        }
    };

    obj[toJSON] = options.toJSON || function () {
        throw new Error(toJSON + ': Overwrite this method.');
    };

    obj[fromJSON] = options.fromJSON || function (value) {
        throw new Error(fromJSON + ': Overwrite this method.');
    };
};

/**

This function extends the `maria.mixinAttribute` function.

In addition to the methods generated by `maria.mixinAttribute`, this function
generates `is*` and `toggle*` methods and makes sensible implementations
of the `toJSON` and `fromJSON` methods.

If not specified, the `default` option is `false`.

If the `coerce` option is set to `true`, a value passed to the attribute's setter
will be coerced to the boolean type. Otherwise a non-boolean value will cause
an error.

@param {object} obj The model object to which a boolean attribute will be added.

@param {string} name The name of the boolean attribute to be added.

@param {object} options The options object. See description for more details.

*/
maria.mixinBooleanAttribute = function (obj, name, options) {
    options = options || {};

    var capitalizedName = maria.capitalize(name),
        get = 'get' + capitalizedName,
        set = 'set' + capitalizedName;

    options['default'] = Object.prototype.hasOwnProperty.call(options, 'default') ? options['default'] : false;

    options.guard = options.guard || function (value) {
        if (options.coerce === true) {
            value = !!value;
        }
        else if (typeof value !== 'boolean') {
            throw new Error('guard' + capitalizedName + ': Type must be boolean. Was "' + (typeof value) +'".');
        }

        return value;
    };

    options.toJSON = options.toJSON || function () {
        return this[get]();
    };

    options.fromJSON = options.fromJSON || function (value) {
        this[set](value);
    };

    maria.mixinAttribute(obj, name, options);

    obj['is' + capitalizedName] = options.is || function () {
        return this[get]();
    };

    obj['toggle' + capitalizedName] = options.toggle || function () {
        this[set](!this[get]());
    };
};

/**

This function extends the `maria.mixinAttribute` function.

In addition to the methods generated by `maria.mixinAttribute`, this function
generates sensible implementations of the `toJSON` and `fromJSON` methods.

If not specified, the `default` option is the empty string.

If the `coerce` option is set to `true`, a value passed to the attribute's setter
will be coerced to the string type. Otherwise a non-string value will cause
an error.

The `trim` option set to `true` will cause values sent to the setter to be trimmed
of leading and trailing whitespace.

If the `enumeration` option is set to an array of strings, any value passed to
the setter must be one of the values specified in the array.

The `minlen` and `maxlen` options can set inclusive bounds on allowed string length.

If the `blank` option is set to `false` then empty strings and strings containing
only whitespace are not allowed.

If the `regexp` option is set then the value must match that regexp.

@param {object} obj The model object to which a string attribute will be added.

@param {string} name The name of the string attribute to be added.

@param {object} options The options object. See description for more details.

*/
maria.mixinStringAttribute = function (obj, name, options) {
    options = options || {};

    var capitalizedName = maria.capitalize(name),
        get = 'get' + capitalizedName,
        set = 'set' + capitalizedName,
        guard = 'guard' + capitalizedName;

    options['default'] = Object.prototype.hasOwnProperty.call(options, 'default') ? options['default'] : '';

    options.guard = options.guard || function (value) {
        if (options.coerce === true) {
            value = '' + value;
        }
        else if (typeof value !== 'string') {
            throw new Error(guard + ': Type must be string. Was "' + (typeof value) + '".');
        }

        if (options.trim === true) {
            value = maria.trim(value);
        }

        if (Object.prototype.hasOwnProperty.call(options, 'enumeration') &&
                !maria.some(options.enumeration, function (item) {return value === item;})) {
            throw new Error(guard + ': Value must be in enumeration. Was "' + value + '".');
        }

        if (Object.prototype.hasOwnProperty.call(options, 'minlen') &&
                (value.length < options.minlen)) {
            throw new Error(guard + ': Value is too short. The value was "' + value + '" which has length "' + value.length + '". The minimum length allowed is "' + options.minlen + '".');
        }

        if (Object.prototype.hasOwnProperty.call(options, 'maxlen') &&
                (options.maxlen < value.length)) {
            throw new Error(guard + ': Value is too long. The value was "' + value + '" which has length "' + value.length + '". The maximum length allowed is "' + options.maxlen + '".');
        }

        if ((options.blank === false) && /^\s*$/.test(value)) {
            throw new Error(guard + ': Value must not be blank. Was "' + value + '".');
        }

        if (Object.prototype.hasOwnProperty.call(options, 'regexp') &&
                !options.regexp.test(value)) {
            throw new Error(guard + ': Value must must match pattern. Was "' + value + '". Pattern is "' + options.regexp + '".');
        }

        return value;
    };

    options.toJSON = options.toJSON || function () {
        return this[get]();
    };

    options.fromJSON = options.fromJSON || function (value) {
        this[set](value);
    };

    maria.mixinAttribute(obj, name, options);
};

/**

This function extends the `maria.mixinAttribute` function.

In addition to the methods generated by `maria.mixinAttribute`, this function
generates sensible implementations of the `toJSON` and `fromJSON` methods.

If not specified, the `default` option is the number 0.

If the `coerce` option is set to `true`, a value passed to the attribute's setter
will be coerced to the number type. Otherwise a non-number value will cause
an error.

If one of the `round`, `floor`, or `ceil` options is set to `true` then the value
passed to the setter function is passed through the `Math` function of
the same name.

If `integer` is set to `true` then the value must be an integer.

If the `enumeration` option is set to an array of numbers, any value passed to
the setter must be one of the values specified in the array.

The `min` and `max` options can set inclusive bounds on the value of the number.

@param {object} obj The model object to which a number attribute will be added.

@param {string} name The name of the number attribute to be added.

@param {object} options The options object. See description for more details.

*/
maria.mixinNumberAttribute = function (obj, name, options) {
    options = options || {};

    var capitalizedName = maria.capitalize(name),
        get = 'get' + capitalizedName,
        set = 'set' + capitalizedName,
        guard = 'guard' + capitalizedName;

    options['default'] = Object.prototype.hasOwnProperty.call(options, 'default') ? options['default'] : 0;

    options.guard = options.guard || function (value) {
        if (options.coerce === true) {
            value = +value;
        }
        else if (typeof value !== 'number') {
            throw new Error(guard + ': Type must be number. Was "' + (typeof value) + '".');
        }

        if (options.round === true) {
            value = Math.round(value);
        }
        else if (options.floor === true) {
            value = Math.floor(value);
        }
        else if (options.ceil === true) {
            value = Math.ceil(value);
        }

        if ((options.integer === true) && (Math.floor(value) !== value)) {
            throw new Error(guard + ': Value must be an integer. Was "' + value + '".');
        }

        if (Object.prototype.hasOwnProperty.call(options, 'min') &&
                (value < options.min)) {
            throw new Error(guard + ': Value too small. Was "' + value + '". The minimum allowed is "' + options.min + '".');
        }

        if (Object.prototype.hasOwnProperty.call(options, 'max') &&
                (options.max < value)) {
            throw new Error(guard + ': Value too large. Was "' + value + '". The maximum allowed is "' + options.max + '".');
        }

        if (Object.prototype.hasOwnProperty.call(options, 'enumeration') &&
                !maria.some(options.enumeration, function (item) {return value === item;})) {
            throw new Error(guard + ': Value must be in enumeration. Was "' + value + '".');
        }

        return value;
    };

    options.toJSON = options.toJSON || function () {
        return this[get]();
    };

    options.fromJSON = options.fromJSON || function (value) {
        this[set](value);
    };

    maria.mixinAttribute(obj, name, options);
};
