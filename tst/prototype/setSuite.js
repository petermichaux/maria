var setSuite;

(function() {

    setSuite = {
        suiteName: 'setSuite',

        "test LIB_set length property": function() {
            jsUnity.assertIdentical(0, LIB_set.length, "LIB_set.length should start life at zero.");
            LIB_set.add('alpha');
            jsUnity.assertIdentical(1, LIB_set.length, "The length should increment to one after adding first element.");
            LIB_set.add('alpha');
            jsUnity.assertIdentical(1, LIB_set.length, "After adding the same element again the length should not change.");
            LIB_set.add('beta');
            jsUnity.assertIdentical(2, LIB_set.length, "After adding two elements the length should be two.");
            LIB_set['delete']('alpha');
            jsUnity.assertIdentical(1, LIB_set.length, "After removing an element the length should decrement.");
            LIB_set['delete']('alpha');
            jsUnity.assertIdentical(1, LIB_set.length, "Removing an element not in the set should not change the length.");
            LIB_set['delete']('beta');
            jsUnity.assertIdentical(0, LIB_set.length, "Removing last element in set should return the length to zero.");
            LIB_set['delete']('beta');
            jsUnity.assertIdentical(0, LIB_set.length, "Removing it again should still keep it at zero.");
        },

        "test length properties are independent on multiple objects": function() {
            var s0 = new LIB_Set();
            var s1 = {};
            LIB_mixinSet(s1);
            
            jsUnity.assertIdentical(0, LIB_set.length);
            jsUnity.assertIdentical(0, s0.length);
            jsUnity.assertIdentical(0, s1.length);
            
            LIB_set.add('alpha');
            jsUnity.assertIdentical(1, LIB_set.length);
            jsUnity.assertIdentical(0, s0.length);
            jsUnity.assertIdentical(0, s1.length);

            s0.add('beta');
            s0.add('gamma');
            jsUnity.assertIdentical(1, LIB_set.length);
            jsUnity.assertIdentical(2, s0.length);
            jsUnity.assertIdentical(0, s1.length);

            s1.add('delta');
            s1.add('epsilon');
            s1.add('zeta');
            jsUnity.assertIdentical(1, LIB_set.length);
            jsUnity.assertIdentical(2, s0.length);
            jsUnity.assertIdentical(3, s1.length);

            // Clean up LIB_set and check that the clean up worked.
            LIB_set['delete']('alpha');
            jsUnity.assertIdentical(0, LIB_set.length);
        },

        "test elements are independent on multiple objects": function() {
            var s0 = new LIB_Set();
            var s1 = {};
            LIB_mixinSet(s1);
            
            LIB_set.add('alpha');
            jsUnity.assertIdentical(true, LIB_set.has('alpha'));
            jsUnity.assertIdentical(false, s0.has('alpha'));
            jsUnity.assertIdentical(false, s1.has('alpha'));

            s0.add('beta');
            jsUnity.assertIdentical(false, LIB_set.has('beta'));
            jsUnity.assertIdentical(true, s0.has('beta'));
            jsUnity.assertIdentical(false, s1.has('beta'));

            s1.add('gamma');
            jsUnity.assertIdentical(false, LIB_set.has('gamma'));
            jsUnity.assertIdentical(false, s0.has('gamma'));
            jsUnity.assertIdentical(true, s1.has('gamma'));

            // Clean up LIB_set and check that the clean up worked.
            LIB_set['delete']('alpha');
            jsUnity.assertIdentical(0, LIB_set.length);
        },

        "test toArray": function() {
            var s = new LIB_Set();
            jsUnity.assertArrayIdentical([], s.toArray());
            s.add('alpha');
            s.add('beta');
            jsUnity.assertArrayIdentical(['alpha', 'beta'], s.toArray());
        },

        "test forEach": function() {
            var s = new LIB_Set('beta', 'alpha');
            var t = [];
            s.forEach(function(el) {
                t.push(el);
            });
            jsUnity.assertArrayIdentical(['alpha', 'beta'], t.sort());
        },

        "test map": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            var t = s.map(function(el) {
                return el.length;
            });
            jsUnity.assertIdentical(2, t.length, 'multiple elements collapse to single element');
            jsUnity.assertIdentical(true, t.has(4));
            jsUnity.assertIdentical(true, t.has(5));
            jsUnity.assertIdentical(false, t.has(6));
        },

        "test filter": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            var t = s.filter(function(el) {
                return el.length === 5;
            });
            jsUnity.assertIdentical(2, t.length);
            jsUnity.assertIdentical(true, t.has('alpha'));
            jsUnity.assertIdentical(false, t.has('beta'));
            jsUnity.assertIdentical(true, t.has('gamma'));
        },

        "test some": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            jsUnity.assertIdentical(true, s.some(function(el) {return el.length === 5;}));
            jsUnity.assertIdentical(false, s.some(function(el) {return el.length === 6;}));
        },

        "test every": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            jsUnity.assertIdentical(false, s.every(function(el) {return el.length === 5;}));
            jsUnity.assertIdentical(true, s.some(function(el) {return typeof el === 'string';}));
        },

        "test reduce": function() {
            var s = new LIB_Set(0,1,2,3,4);
            jsUnity.assertIdentical(10, s.reduce(function(previousValue, currentValue) {
                return previousValue + currentValue;
            }));
        }

    };

}());
