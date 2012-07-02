maria.ElementView.subclass(timeit, 'ClockKnobsView', {
    uiActions: {
        'click .start': 'onClickStart',
        'click .stop' : 'onClickStop' ,
        'click .reset': 'onClickReset'
    }
});
