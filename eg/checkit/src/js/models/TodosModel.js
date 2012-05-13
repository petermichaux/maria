maria.SetModel.subclass(checkit, 'TodosModel', {
    properties: {
        isEmpty: function() {
            return this.length === 0;
        },
        getDone: function() {
            return this.filter(function(todo) {
                return todo.isDone();
            });
        },
        getUndone: function() {
            return this.filter(function(todo) {
                return !todo.isDone();
            });
        },
        isAllDone: function() {
            console.log(this.length);
            return this.length > 0 &&
                   (this.getDone().length === this.length);
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
