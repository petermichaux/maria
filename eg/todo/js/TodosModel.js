maria.SetModel.subclass(checkit, 'TodosModel', {
    methods: {
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
