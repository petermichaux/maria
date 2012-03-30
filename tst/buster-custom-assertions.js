buster.assertions.add("arrayEquals", {
    assert: function (actual, expected) {
        if (expected.length !== actual.length) {
            return false;
        }
        for (var i=0, ilen=expected.length; i<ilen; i++) {
            if (((i in expected) && !(i in actual)) ||
                ((i in actual) && !(i in expected)) ||
                (expected[i] !== actual[i])) {
                return false;
            }
        }
        return true;
    },

    refute: function (actual, expected) {
        return !areEqual(actual, expected);
    },

    assertMessage: "${2}${0} expected to be arrayEqual to ${1}",
    refuteMessage: "${2}${0} expected not to be arrayEqual to ${1}",
    expectation: "toBeArrayEqual"
});
