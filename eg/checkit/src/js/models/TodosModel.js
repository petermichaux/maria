maria.SetModel.subclass(checkit, 'TodosModel', {
    properties: {
        isAllDone: function () {
            return (this.size > 0) &&
                   this.every(function (todo) {
                       return todo.isDone();
                   });
        },
        isAllUndone: function () {
            return this.every(function (todo) {
                       return !todo.isDone();
                   });
        },
        markAllDone: function () {
            this.forEach(function (todo) {
                todo.setDone(true);
            });
        },
        markAllUndone: function () {
            this.forEach(function (todo) {
                todo.setDone(false);
            });
        },
        deleteDone: function () {
            var doneTodos = [];
            this.forEach(function (todo) {
                if (todo.isDone()) {
                    doneTodos.push(todo);
                }
            });
            this['delete'].apply(this, doneTodos);
        }
    }
});
