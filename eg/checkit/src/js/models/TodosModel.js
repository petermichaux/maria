maria.SetModel.subclass(checkit, 'TodosModel', {
    properties: {
        getDone: function() {
            return this.filter(function(todo) {
                return todo.isDone();
            });
        },
        isAllDone: function() {
            return (this.length > 0) &&
                   (this.getDone().length === this.length);
        },
        isAllUndone: function() {
            return this.getDone().length < 1;
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
            this['delete'].apply(this, this.getDone());
        }
    }
});
