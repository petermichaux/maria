maria.ElementView.subclass(timeit, 'ClockKnobsView', {
    modelConstructor: timeit.ClockModel,
    uiActions: {
        'click .start': 'onClickStart',
        'click .stop' : 'onClickStop' ,
        'click .reset': 'onClickReset'
    }
});
