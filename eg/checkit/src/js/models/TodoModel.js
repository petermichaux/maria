maria.Model.subclass(checkit, 'TodoModel', {
    attributes: {
        content: {
            type: 'string',
            trim: true
        },
        done: {
            type: 'boolean'
        }
    }
});
