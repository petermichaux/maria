maria.ElementView.subclass(checkit, 'TodoView', {
    uiActions: {
        'click    .check'       : 'onClickCheck'     ,
        'click    .todo-destroy': 'onClickDestroy'   ,
        'dblclick .todo-content': 'onDblclickDisplay',
        'keyup    .todo-input'  : 'onKeyupInput'     ,
        'keypress .todo-input'  : 'onKeypressInput'  ,
        'blur     .todo-input'  : 'onBlurInput'
    },
    properties: {
        update: function() {
            var model = this.getModel();
            var content = model.getContent();
            this.find('.todo-content').innerHTML =
                content.replace('&', '&amp;').replace('<', '&lt;');
            this.find('.check').checked = model.isDone();
            aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.getRootEl(), 'done');
        },
        showEdit: function() {
            aristocrat.addClass(this.getRootEl(), 'editing');
            var input = this.find('.todo-input');
            input.value = this.getModel().getContent();
            input.focus();
        },
        showDisplay: function() {
            aristocrat.removeClass(this.getRootEl(), 'editing');
        },
        getInputValue: function() {
            return this.find('.todo-input').value;
        },
        showToolTip: function() {
            this.find('.ui-tooltip-top').style.display = 'block';
        },
        hideToolTip: function() {
            this.find('.ui-tooltip-top').style.display = 'none';
        }
    }
});
