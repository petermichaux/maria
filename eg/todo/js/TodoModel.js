maria.Model.subclass(checkit, 'TodoModel', {
    members: {
        _content: '',
        _isDone: false
    },
    methods: {
        getContent: function() {
            return this._content;
        },
        setContent: function(content) {
            content = ('' + content).replace(/^\s+|\s+$/g, '');
            if (this._content !== content) {
                this._content = content;
                this.dispatchEvent({type: 'change'});
            }
        },
        isDone: function() {
            return this._isDone;
        },
        setDone: function(isDone) {
            isDone = !!isDone;
            if (this._isDone !== isDone) {
                this._isDone = isDone;
                this.dispatchEvent({type: 'change'});
            }
        },
        toggleDone: function() {
            this.setDone(!this.isDone());
        }
    }
});
