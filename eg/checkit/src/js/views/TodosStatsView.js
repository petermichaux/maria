maria.ElementView.subclass(checkit, 'TodosStatsView', {
    properties: {
        update: function() {
            this.find('.todos-count').innerHTML = this.getModel().length;
        }
    }
});
