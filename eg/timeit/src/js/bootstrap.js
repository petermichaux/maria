maria.addEventListener(window, 'load', function() {
    var loading = document.getElementById('loading');
    loading.parentNode.removeChild(loading);

    var model = new timeit.ClockModel();

    if (typeof timeit.AnalogueClockView === 'function') {
        var analogueClockView = new timeit.AnalogueClockView(model);
        document.body.appendChild(analogueClockView.build());
    }

    var digitalClockView = new timeit.DigitalClockView(model);
    document.body.appendChild(digitalClockView.build());
    
    var clockKnobsView = new timeit.ClockKnobsView(model);
    document.body.appendChild(clockKnobsView.build());
});
