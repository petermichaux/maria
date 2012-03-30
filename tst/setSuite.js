(function() {

    buster.testCase('setSuite', {

        "test set starts with no elements": function() {
            var s = new LIB_Set();
            assert.same(0, s.length, "set should start empty");
            assert.same(false, s.has('alpha'), "an empty list should not have an 'alpha' element");
        },

        "test add and delete return value": function() {
            var s = new LIB_Set();
            assert.same(true, s.add('alpha'), 'adding an item not in the list should return true.');
            assert.same(false, s.add('alpha'), 'adding an item in the list should return false.');
            assert.same(true, s['delete']('alpha'), 'deleting an item in the list should return true.');
            assert.same(false, s['delete']('alpha'), 'deleting an item not in the list should return false');
        },

        "test has": function() {
            var s = new LIB_Set();
            s.add('alpha');
            assert.same(true, s.has('alpha'));
        },

        "test set starts without NaN element": function() {
            var s = new LIB_Set();
            assert.same(false, s.has(NaN));
        },

        "test has NaN can find NaN in the set": function() {
            var s = new LIB_Set();
            s.add(NaN);
            assert.same(true, s.has(NaN));
        },

        "test delete NaN": function() {
            var s = new LIB_Set();
            s.add(NaN);
            s['delete'](NaN);
            assert.same(false, s.has(NaN));
        },

        "test empty": function() {
            var s = new LIB_Set();
            s.add('alpha');
            s.add('beta');
            assert.same(true, s.has('alpha'));
            assert.same(true, s.has('beta'));
            assert.same(true, s.empty(), "emptying a non-empty set should return true");
            assert.same(0, s.length);
            assert.same(false, s.has('alpha'));
            assert.same(false, s.has('beta'));
            assert.same(false, s.empty(), "emptying an empty set should return false");
        },

        "test LIB_set length property": function() {
            var s = new LIB_Set();

            assert.same(0, s.length, "s.length should start life at zero.");
            s.add('alpha');
            assert.same(1, s.length, "The length should increment to one after adding first element.");
            s.add('alpha');
            assert.same(1, s.length, "After adding the same element again the length should not change.");
            s.add('beta');
            assert.same(2, s.length, "After adding two elements the length should be two.");
            s['delete']('alpha');
            assert.same(1, s.length, "After removing an element the length should decrement.");
            s['delete']('alpha');
            assert.same(1, s.length, "Removing an element not in the set should not change the length.");
            s['delete']('beta');
            assert.same(0, s.length, "Removing last element in set should return the length to zero.");
            s['delete']('beta');
            assert.same(0, s.length, "Removing it again should still keep it at zero.");
        },

        "test length properties are independent on multiple objects": function() {
            var s0 = new LIB_Set();
            var s1 = new LIB_Set();

            assert.same(0, s0.length);
            assert.same(0, s1.length);

            s0.add('alpha');
            assert.same(1, s0.length);
            assert.same(0, s1.length);

            s1.add('beta');
            s1.add('gamma');
            assert.same(1, s0.length);
            assert.same(2, s1.length);
        },

        "test elements are independent on multiple objects": function() {
            var s0 = new LIB_Set();
            var s1 = new LIB_Set();

            s0.add('alpha');
            assert.same(true, s0.has('alpha'));
            assert.same(false, s1.has('alpha'));

            s1.add('beta');
            assert.same(false, s0.has('beta'));
            assert.same(true, s1.has('beta'));
        },

        "test toArray": function() {
            var s = new LIB_Set();
            assert.arrayEquals([], s.toArray());
            s.add('alpha');
            s.add('beta');
            assert.arrayEquals(['alpha', 'beta'], s.toArray());
        },

        "test forEach": function() {
            var s = new LIB_Set('beta', 'alpha');
            var t = [];
            s.forEach(function(el) {
                t.push(el);
            });
            assert.arrayEquals(['alpha', 'beta'], t.sort());
        },

        "test map": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            var t = s.map(function(el) {
                return el.length;
            });
            assert.same(2, t.length, 'multiple elements collapse to single element');
            assert.same(true, t.has(4));
            assert.same(true, t.has(5));
            assert.same(false, t.has(6));
        },

        "test filter": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            var t = s.filter(function(el) {
                return el.length === 5;
            });
            assert.same(2, t.length);
            assert.same(true, t.has('alpha'));
            assert.same(false, t.has('beta'));
            assert.same(true, t.has('gamma'));
        },

        "test some": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            assert.same(true, s.some(function(el) {return el.length === 5;}));
            assert.same(false, s.some(function(el) {return el.length === 6;}));
        },

        "test every": function() {
            var s = new LIB_Set('alpha', 'beta', 'gamma');
            assert.same(false, s.every(function(el) {return el.length === 5;}));
            assert.same(true, s.some(function(el) {return typeof el === 'string';}));
        },

        "test reduce": function() {
            var s = new LIB_Set(0,1,2,3,4);
            assert.same(10, s.reduce(function(previousValue, currentValue) {
                return previousValue + currentValue;
            }));
        }

    });

}());
