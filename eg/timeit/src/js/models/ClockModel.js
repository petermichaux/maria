(function() {

    // Some pure functions that help with validation.

    function isValidHour(h) {
        return (typeof h === 'number') &&
               (Math.floor(h) == h) &&
               (h >= 0) &&
               (h <= 23);
    }

    function isValidMinute(m) {
        return (typeof m === 'number') &&
               (Math.floor(m) == m) &&
               (m >= 0) &&
               (m <= 59);
    }

    var isValidSecond = isValidMinute;

    maria.Model.subclass(timeit, 'ClockModel', {
        properties: {
            _hour: 0,
            _minute: 0,
            _second: 0,
            _running: false,
            _interval: null,
            getTime: function() {
                return {
                    hour: this._hour,
                    minute: this._minute,
                    second: this._second
                };
            },
            setTime: function(h, m, s) {
                // Always use very robust checking on values sent to a model.
                if (!isValidHour(h)) {
                    throw new Error('hour is not valid');
                }
                if (!isValidMinute(m)) {
                    throw new Error('minute is not valid');
                }
                if (!isValidSecond(s)) {
                    throw new Error('second is not valid');
                }
                if ((this._hour !== h) ||
                    (this._minute !== m) ||
                    (this._second !== s)) {
                    this._hour = h;
                    this._minute = m;
                    this._second = s;
                    this.dispatchEvent({type: 'change'});
                }
            },
            resetTime: function() {
                this.setTime(0, 0, 0);
            },
            _tick: function() {
                var h = this._hour;
                var m = this._minute;
                var s = this._second;
                
                s++;
                if (s > 59) {
                    s = 0;
                    m++;
                    if (m > 59) {
                        m = 0;
                        h++;
                        if (h > 23) {
                            h = 0;
                        }
                    }
                }
                
                this.setTime(h, m, s);
            },
            start: function() {
                if (!this._running) {
                    this._running = true;
                    var thisC = this;
                    this._interval = setInterval(function() {
                        thisC._tick();
                    }, 1000);
                    this.dispatchEvent({type: 'change'});
                }
            },
            stop: function(isDone) {
                if (this._running) {
                    this._running = false;
                    clearInterval(this._interval);
                    this._interval = null;
                    this.dispatchEvent({type: 'change'});
                }
            }
        }
    });

}());
