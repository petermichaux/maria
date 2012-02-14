var setSuite;

(function() {

    setSuite = {
        suiteName: 'setSuite',

        "test add and delete return value": function() {
            var s = new LIB_Set();
            jsUnity.assertIdentical(true, s.add('alpha'), 'adding an item not in the list should return true.');
            jsUnity.assertIdentical(false, s.add('alpha'), 'adding an item in the list should return false.');
            jsUnity.assertIdentical(true, s['delete']('alpha'), 'deleting an item in the list should return true.');
            jsUnity.assertIdentical(false, s['delete']('alpha'), 'deleting an item not in the list should return false');
        },

        "test LIB_set length property": function() {
            var s = new LIB_Set();
            
            jsUnity.assertIdentical(0, s.length, "s.length should start life at zero.");
            s.add('alpha');
            jsUnity.assertIdentical(1, s.length, "The length should increment to one after adding first element.");
            s.add('alpha');
            jsUnity.assertIdentical(1, s.length, "After adding the same element again the length should not change.");
            s.add('beta');
            jsUnity.assertIdentical(2, s.length, "After adding two elements the length should be two.");
            s['delete']('alpha');
            jsUnity.assertIdentical(1, s.length, "After removing an element the length should decrement.");
            s['delete']('alpha');
            jsUnity.assertIdentical(1, s.length, "Removing an element not in the set should not change the length.");
            s['delete']('beta');
            jsUnity.assertIdentical(0, s.length, "Removing last element in set should return the length to zero.");
            s['delete']('beta');
            jsUnity.assertIdentical(0, s.length, "Removing it again should still keep it at zero.");
        },

        "test length properties are independent on multiple objects": function() {
            var s0 = new LIB_Set();
            var s1 = new LIB_Set();
            
            jsUnity.assertIdentical(0, s0.length);
            jsUnity.assertIdentical(0, s1.length);
            
            s0.add('alpha');
            jsUnity.assertIdentical(1, s0.length);
            jsUnity.assertIdentical(0, s1.length);

            s1.add('beta');
            s1.add('gamma');
            jsUnity.assertIdentical(1, s0.length);
            jsUnity.assertIdentical(2, s1.length);
        },

        "test elements are independent on multiple objects": function() {
            var s0 = new LIB_Set();
            var s1 = new LIB_Set();
            
            s0.add('alpha');
            jsUnity.assertIdentical(true, s0.has('alpha'));
            jsUnity.assertIdentical(false, s1.has('alpha'));

            s1.add('beta');
            jsUnity.assertIdentical(false, s0.has('beta'));
            jsUnity.assertIdentical(true, s1.has('beta'));
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
