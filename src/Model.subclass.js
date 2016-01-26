/**

A function that makes subclassing maria.Model more compact.

The following example creates a checkit.TodoModel constructor function
equivalent to the more verbose examples shown in the documentation
for maria.Model.

    maria.Model.subclass(checkit, 'TodoModel', {
        attributes: {
            content: {
                type: 'string',
                coerce: true,
                trim: true
            },
            done: {
                type: 'boolean',
                coerce: true
            }
        }
    });

*/
maria.Model.subclass = function (namespace, name, options) {
    maria.subclass.call(this, namespace, name, options);

    if (options && Object.prototype.hasOwnProperty.call(options, 'attributes')) {
        var attributes = options.attributes,
            obj = {};

        for (var attributeName in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attributeName)) {
                var attributeSpec = attributes[attributeName];
                if (!Object.prototype.hasOwnProperty.call(attributeSpec, 'type')) {
                    throw new Error('maria.Model.subclass: Type for attribute "' + attributeName + '" must be specified.');
                }
                /* DEBUG BEGIN */
                if (typeof maria['mixin' + maria.capitalize(attributeSpec.type) + 'Attribute'] !== 'function') {
                    console.error('maria.Model.subclass: While processing attributes, could not find function with name "maria.mixin' + maria.capitalize(attributeSpec.type) + 'Attribute".');
                }
                /* DEBUG END */
                maria['mixin' + maria.capitalize(attributeSpec.type) + 'Attribute'](obj, attributeName, attributeSpec);
            }
        }

        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop) &&
                    !Object.prototype.hasOwnProperty.call(namespace[name].prototype, prop)) {
                namespace[name].prototype[prop] = obj[prop];
            }
        }
    }

    if (!Object.prototype.hasOwnProperty(namespace[name], 'fromJSON')) {
        namespace[name].fromJSON = function (json) {
            return this.superConstructor.fromJSON.call(this, json);
        };
    }
};
