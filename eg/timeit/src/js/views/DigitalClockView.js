(function() {

    function padNum(i) {
        return ((i < 10) ? '0' : '') + i;
    }

    function formatTimeString(h, m, s) {
        return padNum(h) + ':' + padNum(m) + ':' + padNum(s);
    }

    maria.ElementView.subclass(timeit, 'DigitalClockView', {
        modelConstructor: timeit.ClockModel,
        properties: {
            update: function() {
                var time = this.getModel().getTime();
                this.find('.time').innerHTML =
                    formatTimeString(time.hour, time.minute, time.second);
            }
        }
    });

}());
