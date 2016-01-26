(function() {

    buster.testCase('Model Suite', {

        "test Model has superConstructor evento.EventTarget": function() {
            assert.same(evento.EventTarget, maria.Model.superConstructor);
        },

        "test models have EventTarget interface": function() {
            var m = new maria.Model();

            assert.isFunction(m.addEventListener, 'should have addEventListener');
            assert.isFunction(m.removeEventListener, 'should have removeEventListener');
            assert.isFunction(m.dispatchEvent, 'should have dispatchEvent');
            assert.isFunction(m.addParentEventTarget, 'should have addParentEventTarget');
            assert.isFunction(m.removeParentEventTarget, 'should have removeParentEventTarget');
        },

        "test models dispatch a destroy event when destroy method is called": function() {
            var m = new maria.Model();
            var called = false;
            m.addEventListener('destroy', function() {called = true;});
            m.destroy();
            assert.same(true, called);
        },

        "test reset calls only methods with 'reset' prefix": function() {
            var m = new maria.Model();
            var getACalled = false,
                resetACalled = false,
                resetBCalled = false;
            m.getA = function() {
                getACalled = true;
            };
            m.resetA = function() {
                resetACalled = true;
            };
            m.resetB = function() {
                resetBCalled = true;
            };
            m.reset();
            assert.same(false, getACalled, 'getA method should not have been called');
            assert.same(true, resetACalled, 'resetA method should have been called');
            assert.same(true, resetBCalled, 'resetB method should have been called');
        },

        "test toJSON calls only methods with 'ToJSON' suffix": function() {
            var m = new maria.Model();
            var getACalled = false,
                aToJSONCalled = false,
                bToJSONCalled = false;
            m.getA = function() {
                getACalled = true;
            };
            m.aToJSON = function() {
                aToJSONCalled = true;
            };
            m.bToJSON = function() {
                bToJSONCalled = true;
            };
            m.toJSON();
            assert.same(false, getACalled, 'getA method should not have been called');
            assert.same(true, aToJSONCalled, 'aToJSON method should have been called');
            assert.same(true, bToJSONCalled, 'bToJSON method should have been called');
        },

        "test toJSON produces object suitable to be serialized to JSON": function() {
            var m = new maria.Model();
            m.aToJSON = function() {
                return "123";
            };
            m.bToJSON = function() {
                return 456;
            };
            var obj = m.toJSON();
            assert.same(obj.a, "123");
            assert.same(obj.b, 456);
        },

        "test fromJSON calls only methods with 'FromJSON' suffix": function() {
            var m = new maria.Model();
            var getACalled = false,
                aFromJSONCalled = false,
                bFromJSONCalled = false,
                cFromJSONCalled = false,
                a,
                b;
            m.getA = function() {
                getACalled = true;
            };
            m.aFromJSON = function(val) {
                aFromJSONCalled = true;
                a = val;
            };
            m.bFromJSON = function(val) {
                bFromJSONCalled = true;
                b = val;
            };
            m.cFromJSON = function() {
                bFromJSONCalled = true;
            };
            var obj = m.fromJSON({
                a: 1,
                b: 2
            });
            assert.same(false, getACalled, 'getA method should not have been called');
            assert.same(true, aFromJSONCalled, 'aFromJSON method should have been called');
            assert.same(1, a, 'aFromJSON method was not called with correct value');
            assert.same(true, bFromJSONCalled, 'bFromJSON method should have been called');
            assert.same(2, b, 'bFromJSON method was not called with the correct value');
            assert.same(false, cFromJSONCalled, 'cFromJSON method should not have been called');
        },

        "test class-level fromJSON": function() {
            var a;

            maria.Model.prototype.aFromJSON = function(val) {
                a = val;
            };

            var m = maria.Model.fromJSON({
                a: 44
            });

            assert.same(44, a, 'a not set correctly');

            delete maria.Model.prototype.aFromJSON;
        },

        "test maria.mixinAttribute": function() {
            var m = new maria.Model();
            maria.mixinAttribute(m, 'name', {
                guard: function (value) {
                    // coerce any input to string
                    return '' + value;
                }
            });

            assert.same(m.getName(), undefined);
            m.setName('Adam');
            assert.same(m.getName(), 'Adam');
            m.resetName();
            assert.same(m.getName(), undefined);
            m.setName(123);
            assert.same(m.getName(), '123');
        },

        "test maria.mixinBooleanAttribute": function() {
            var m = new maria.Model();
            maria.mixinBooleanAttribute(m, 'agreed');

            assert.same(m.getAgreed(), false);
            m.setAgreed(true);
            assert.same(m.getAgreed(), true);
            assert.same(m.isAgreed(), true);
            m.resetAgreed();
            assert.same(m.getAgreed(), false);
            assert.same(m.agreedToJSON(), false);
            m.agreedFromJSON(true);
            assert.same(m.agreedToJSON(), true);
            m.toggleAgreed();
            assert.same(m.agreedToJSON(), false);
        },

        "test maria.mixinStringAttribute": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color');

            assert.same(m.getColor(), '');
            m.setColor('red');
            assert.same(m.getColor(), 'red');
            m.setColor('  green  ');
            assert.same(m.getColor(), '  green  ');
            assert.exception(function() {
                m.setColor(123);
            });
        },

        "test maria.mixinStringAttribute coerce": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color', {
                'default': 'red',
                coerce: true
            });

            assert.same(m.getColor(), 'red');
            m.setColor(123);
            assert.same(m.getColor(), '123');
        },

        "test maria.mixinStringAttribute trim": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color', {
                'default': 'red',
                trim: true
            });

            assert.same(m.getColor(), 'red');
            m.setColor('  blue  ');
            assert.same(m.getColor(), 'blue');
        },

        "test maria.mixinStringAttribute enumeration": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color', {
                'default': 'red',
                enumeration: ['red', 'green', 'blue']
            });

            assert.same(m.getColor(), 'red');
            m.setColor('green');
            assert.same(m.getColor(), 'green');
            m.resetColor();
            assert.same(m.getColor(), 'red');
            assert.exception(function () {
                m.setColor('purple');
            });
        },

        "test maria.mixinStringAttribute maxlen": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color', {
                'default': 'red',
                maxlen: 4
            });

            assert.same(m.getColor(), 'red');
            m.setColor('blue');
            assert.same(m.getColor(), 'blue');
            assert.exception(function () {
                m.setColor('green');
            });
        },

        "test maria.mixinStringAttribute minlen": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color', {
                'default': 'blue',
                minlen: 4
            });

            assert.same(m.getColor(), 'blue');
            m.setColor('green');
            assert.same(m.getColor(), 'green');
            assert.exception(function () {
                m.setColor('red');
            });
        },

        "test maria.mixinStringAttribute blank": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color', {
                'default': 'blue',
                blank: false
            });

            assert.same(m.getColor(), 'blue');
            m.setColor('green');
            assert.same(m.getColor(), 'green');
            assert.exception(function () {
                m.setColor('');
            });
        },

        "test maria.mixinStringAttribute regexp": function() {
            var m = new maria.Model();
            maria.mixinStringAttribute(m, 'color', {
                'default': 'blue',
                regexp: /red|blue/
            });

            assert.same(m.getColor(), 'blue');
            m.setColor('red');
            assert.same(m.getColor(), 'red');
            assert.exception(function () {
                m.setColor('green');
            });
        },

        "test maria.mixinNumberAttribute": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height');

            assert.same(m.getHeight(), 0);
            m.setHeight(123);
            assert.same(m.getHeight(), 123);
            assert.exception(function() {
                m.setHeight('red');
            });
        },

        "test maria.mixinNumberAttribute coerce": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 123,
                coerce: true
            });

            assert.same(m.getHeight(), 123);
            m.setHeight('777');
            assert.same(m.getHeight(), 777);
        },

        "test maria.mixinNumberAttribute round": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 123,
                round: true,
                integer: true
            });

            assert.same(m.getHeight(), 123);
            m.setHeight(333.3);
            assert.same(m.getHeight(), 333);
        },


        "test maria.mixinNumberAttribute floor": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 123,
                floor: true,
                integer: true
            });

            assert.same(m.getHeight(), 123);
            m.setHeight(888.88);
            assert.same(m.getHeight(), 888);
        },


        "test maria.mixinNumberAttribute ceil": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 123,
                ceil: true,
                integer: true
            });

            assert.same(m.getHeight(), 123);
            m.setHeight(444.44);
            assert.same(m.getHeight(), 445);
        },

        "test maria.mixinNumberAttribute integer": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 456,
                integer: true
            });

            assert.same(m.getHeight(), 456);
            m.setHeight(789);
            assert.same(m.getHeight(), 789);
            assert.exception(function () {
                m.setHeight(9.9);
            });
        },

        "test maria.mixinNumberAttribute enumeration": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 123,
                enumeration: [123, 456, 789]
            });

            assert.same(m.getHeight(), 123);
            m.setHeight(789);
            assert.same(m.getHeight(), 789);
            m.resetHeight();
            assert.same(m.getHeight(), 123);
            assert.exception(function () {
                m.setHeight(111);
            });
        },

        "test maria.mixinNumberAttribute min": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 456,
                min: 4
            });

            assert.same(m.getHeight(), 456);
            m.setHeight(789);
            assert.same(m.getHeight(), 789);
            assert.exception(function () {
                m.setHeight(3.9);
            });
        },

        "test maria.mixinNumberAttribute max": function() {
            var m = new maria.Model();
            maria.mixinNumberAttribute(m, 'height', {
                'default': 1.3,
                max: 4
            });

            assert.same(m.getHeight(), 1.3);
            m.setHeight(2.2);
            assert.same(m.getHeight(), 2.2);
            assert.exception(function () {
                m.setHeight(4.1);
            });
        }
    });

}());
