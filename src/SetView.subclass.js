/**

@property maria.SetView.subclass

@description

The same as maria.ElementView.

You will likely want to specify a createChildView method.

The following example creates a checkit.TodosListView constructor
function equivalent to the more verbose example shown in the
documentation for maria.SetView.

    maria.SetView.subclass(checkit, 'TodosListView', {
        properties: {
            createChildView: function(todoModel) {
                return new checkit.TodoView(todoModel);
            }
        }
    });

*/
maria.SetView.subclass = maria.ElementView.subclass;
