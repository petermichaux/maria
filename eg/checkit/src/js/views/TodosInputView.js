maria.ElementView.subclass(checkit, 'TodosInputView', {
    uiActions: {
        'focus    .content': 'onFocusInput'   ,
        'blur     .content': 'onBlurInput'    ,
        'keyup    .content': 'onKeyupInput'   ,
        'keypress .content': 'onKeypressInput'
    },
    properties: {
        getInputValue: function() {
            return this.find('.content').value;
        },
        clearInput: function() {
            this.find('.content').value = '';
        },
        setPending: function(pending) {
            aristocrat[pending ? 'addClass' : 'removeClass'](
                this.find('.TodosInput'), 'TodosInputPending');
        }
    }
});
