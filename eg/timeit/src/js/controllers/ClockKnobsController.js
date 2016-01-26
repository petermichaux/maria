maria.Controller.subclass(timeit, 'ClockKnobsController', {
    properties: {
        onClickStart: function () {
            this.getModel().start();
        },
        onClickStop: function () {
            this.getModel().stop();
        },
        onClickReset: function () {
            this.getModel().resetTime();
        }
    }
});
