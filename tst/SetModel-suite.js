(function () {

    buster.testCase('SetModel Suite', {

        "test SetModel has superConstructor Model": function () {
            assert.same(maria.Model, maria.SetModel.superConstructor);
        },

        "test has, add, and delete still work": function () {

            var s = new maria.SetModel();

            var alpha = {};

            assert.same(false, s.has(alpha), 'alpha not in set to start.');
            assert.same(false, s['delete'](alpha), 'deleting alpha not in set returns false.');
            assert.same(true, s.add(alpha), 'adding alpha to set returns true.');
            assert.same(true, s.has(alpha), 'alpha is now in the set.');
            assert.same(false, s.add(alpha), 'adding alpha again to set returns false.');
            assert.same(true, s['delete'](alpha), 'deleting alpha in set returns true.');
        },

        "test add no items": function () {
            var s = new maria.SetModel();
            assert.same(false, s.add(), "adding nothing should work and return false");
        },

        "test delete no items": function () {
            var alpha = {};
            var beta = {};
            var s = new maria.SetModel(alpha, beta);
            assert.same(false, s['delete'](), "deleting nothing should work and return false");
        },

        "test add and delete events dispatched": function () {

            var s = new maria.SetModel();

            var alpha = {};

            var additions = 0;
            var deletions = 0;
            s.addEventListener('change', function (evt) {
                if (evt.addedTargets && evt.addedTargets.length) {
                    additions++;
                }
                if (evt.deletedTargets && evt.deletedTargets.length) {
                    deletions++;
                }
            });

            assert.same(0, additions, 'no additions to start.');
            assert.same(0, deletions, 'no deletions to start.');
            s.add(alpha);
            assert.same(0, deletions, 'no deletions after first addition.');
            assert.same(1, additions, 'when adding an item not in the list, listeners are called.');
            s.add(alpha);
            assert.same(0, deletions, 'no deletions after failed addition.');
            assert.same(1, additions, 'when adding an item in the list, listeners not called.');
            s['delete'](alpha);
            assert.same(1, additions, 'still 1 addition after first delete.')
            assert.same(1, deletions, 'when deleting an item in the list, listeners are called.');
            s['delete'](alpha);
            assert.same(1, additions, 'still 1 addition after failed delete.')
            assert.same(1, deletions, 'when deleting an item now in the list, listeners not called.');

        },

        "test add delete multiple elements in one call": function () {

            var s = new maria.SetModel();

            var alpha = {};
            var beta = {};

            var addEvents = 0;
            var deleteEvents = 0;

            s.addEventListener('change', function (evt) {
                if (evt.addedTargets && evt.addedTargets.length) {
                    addEvents++;
                }
                if (evt.deletedTargets && evt.deletedTargets.length) {
                    deleteEvents++;
                }
            });

            assert.same(false, s.has(alpha), 'alpha not in set to start.');
            assert.same(false, s.has(beta), 'beta not in set to start.');
            assert.same(true, s.add(alpha, beta), 'adding alpha and beta to set should work');
            assert.same(true, s.has(alpha), 'alpha now in set.');
            assert.same(true, s.has(beta), 'beta now in set.');
            assert.same(1, addEvents, 'two items added to set but only one event fired.');

            assert.same(false, s.add(alpha), 'adding alpha again does not do anything');
            assert.same(1, addEvents, 'add event not fired.');

            assert.same(true, s['delete'](alpha, beta), 'deleting alpha and beta to set should work');
            assert.same(1, deleteEvents, 'two items deleted to set but only one event fired.');

            assert.same(false, s.has(alpha), 'alpha not in set to end.');
            assert.same(false, s.has(beta), 'beta not in set to end.');

            assert.same(false, s['delete'](alpha), 'deleting alpha again should not do anything');
            assert.same(1, deleteEvents, 'delete event not fired.');

        },

        "test automatic bubbling": function () {

            var child = new evento.EventTarget();
            var parent = new maria.SetModel();
            var root = new maria.SetModel();

            var resultChild;
            var resultParent;
            var resultRoot;

            child.addEventListener('foo', function (ev) {
                resultChild = ev;
            });

            parent.addEventListener('foo', function (ev) {
                resultParent = ev;
            });

            root.addEventListener('foo', function (ev) {
                resultRoot = ev;
            });

            resultChild = resultParent = resultRoot = null;
            child.dispatchEvent({type: 'foo'});
            assert(resultChild, 'phase I: the child should have received the event');
            assert(!resultParent, 'phase I: the parent should not have received the event');
            assert(!resultRoot, 'phase I: the root should not have received the event');

            resultChild = resultParent = resultRoot = null;
            parent.add(child);
            child.dispatchEvent({type: 'foo'});
            assert(resultChild, 'phase II: the child should have received the event');
            assert(resultParent, 'phase II: the parent should have received the event');
            assert(!resultRoot, 'phase II: the root should not have received the event');

            resultChild = resultParent = resultRoot = null;
            root.add(parent);
            child.dispatchEvent({type: 'foo'});
            assert(resultChild, 'phase III: the child should have received the event');
            assert(resultParent, 'phase III: the parent should have received the event');
            assert(resultRoot, 'phase III: the root should not have received the event');

            assert.same(resultChild.target, child);
            assert.same(resultChild.currentTarget, child);
            assert.same(resultParent.target, child);
            assert.same(resultParent.currentTarget, parent);
            assert.same(resultRoot.target, child);
            assert.same(resultRoot.currentTarget, root);

        },

        "test add does bubble": function () {
            var alpha = {};
            var childSet = new maria.SetModel();
            var parentSet = new maria.SetModel();
            var addBubbled = false;
            var afterAddBubbled = true;
            parentSet.add(childSet);
            parentSet.addEventListener('change', function (ev) {
                addBubbled = true;
            });
            childSet.add(alpha);
            assert.same(true, addBubbled, 'the parent set should know an element is added to the child set');
        },

        "test delete does bubble": function () {
            var alpha = {};
            var childSet = new maria.SetModel();
            var parentSet = new maria.SetModel();
            var deleteBubbled = false;
            var afterDeleteBubbled = true;
            parentSet.add(childSet);
            parentSet.addEventListener('change', function (ev) {
                if (ev.deletedTargets && ev.deletedTargets.length) {
                    deleteBubbled = true;
                }
            });
            childSet.add(alpha);
            childSet['delete'](alpha);
            assert.same(true, deleteBubbled, 'the parent set should know an element is deleted from the child set');
        },

        "test delete does bubble when clearing": function () {
            var alpha = {};
            var childSet = new maria.SetModel();
            var parentSet = new maria.SetModel();
            var deleteBubbled = false;
            var afterDeleteBubbled = true;
            parentSet.add(childSet);
            parentSet.addEventListener('change', function (ev) {
                if (ev.deletedTargets && ev.deletedTargets.length) {
                    deleteBubbled = true;
                }
            });
            childSet.add(alpha);
            childSet.clear();
            assert.same(true, deleteBubbled, 'the parent set should know an element is deleted from the child set when clearing the child set');
        },

        "test destroy event on element removes it from the set": function () {
            var element = new evento.EventTarget();
            var set = new maria.SetModel();
            set.add(element);
            assert.same(1, set.size, "the set should contain the element and so have size 1");
            assert.same(true, set.has(element), "the set should contain the element");
            element.dispatchEvent({type: 'destroy'});
            assert.same(0, set.size, "the set should not contain the element and so should have size 0");
            assert.same(false, set.has(element), "the set should not contain the element");
        },

        "test clear dispatches events": function () {
            var alpha = {};
            var beta = {};
            var s = new maria.SetModel(alpha, beta);
            var deleteEvents = 0;
            s.addEventListener('change', function (evt) {
                if (evt.deletedTargets && evt.deletedTargets.length) {
                    deleteEvents++;
                }
            });
            s.clear();
            assert.same(1, deleteEvents, "the delete listener should have been called only once");
        },

        "test clear removes listeners from subject elements": function () {
            var element = new evento.EventTarget();
            var set = new maria.SetModel();
            set.add(element);

            var calls = 0;
            set.addEventListener('foo', function (ev) {
                calls++;
            });
            element.dispatchEvent({type: 'foo'});
            assert.same(1, calls, "the element listener from the set should have been called when the element is in the set");
            set.clear();
            element.dispatchEvent({type: 'foo'});
            assert.same(1, calls, "the element listener from the set should not have been called after clearing the set");

        },

        "test getDefaultElementConstructor": function () {
            var m = new maria.SetModel();
            assert.same(maria.Model, m.getDefaultElementConstructor(), "the default element constructor should be maria.Model");
        },

        "test toJSON": function () {
            var jerry = new maria.Model();
            maria.borrow(jerry, {
                idToJSON: function () {
                    return 442;
                },
                nameToJSON: function () {
                    return 'Jerry';
                }
            });
            var pierce = new maria.Model();
            maria.borrow(pierce, {
                idToJSON: function () {
                    return 3;
                },
                nameToJSON: function () {
                    return 'Captain Pierce';
                }
            });
            var s = new maria.SetModel(jerry, pierce);
            var json = s.toJSON();
            assert.isArray(json);
            // sets are unordered so sort it before examining contents
            json.sort(function (a, b) {
                return (a.id < b.id) ?
                           -1 :
                           (a.id > b.id) ?
                               1:
                               0;
            });
            assert.same(3, json[0].id);
            assert.same('Captain Pierce', json[0].name);
            assert.same(442, json[1].id);
            assert.same('Jerry', json[1].name);
        },

        "test fromJSON": function () {
            var app = {};

            app.PersonModel = function () {
                maria.Model.apply(this, arguments);
            };
            app.PersonModel.superConstructor = maria.Model;
            app.PersonModel.prototype = maria.create(maria.Model.prototype);
            app.PersonModel.prototype.constructor = app.PersonModel;
            maria.mixinStringAttribute(app.PersonModel.prototype, 'name');
            app.PersonModel.fromJSON = function (json) {
                return maria.Model.fromJSON.call(this, json);
            };

            app.PeopleSetModel = function () {
                maria.SetModel.apply(this, arguments);
            };
            app.PeopleSetModel.superConstructor = maria.SetModel;
            app.PeopleSetModel.prototype = maria.create(maria.SetModel.prototype);
            app.PeopleSetModel.prototype.constructor = app.PeopleSetModel;
            app.PeopleSetModel.prototype.getDefaultElementConstructor = function () {
                return app.PersonModel;
            };

            var people = new app.PeopleSetModel();
            people.fromJSON([{name: 'Sgt Baker'}, {name: 'Mr Krinkle'}]);
            var result = people.toArray().sort(function (a, b) {
                return (a.getName() < b.getName()) ?
                           -1 :
                           (a.getName() > b.getName()) ?
                               1:
                               0;
            });
            assert.same(2, result.length);
            assert.same('Mr Krinkle', result[0].getName());
            assert.same('Sgt Baker', result[1].getName());
        },

        "test fromJSON class method": function () {
            var app = {};

            app.PersonModel = function () {
                maria.Model.apply(this, arguments);
            };
            app.PersonModel.superConstructor = maria.Model;
            app.PersonModel.prototype = maria.create(maria.Model.prototype);
            app.PersonModel.prototype.constructor = app.PersonModel;
            maria.mixinStringAttribute(app.PersonModel.prototype, 'name');
            app.PersonModel.fromJSON = function (json) {
                return maria.Model.fromJSON.call(this, json);
            };

            app.PeopleSetModel = function () {
                maria.SetModel.apply(this, arguments);
            };
            app.PeopleSetModel.superConstructor = maria.SetModel;
            app.PeopleSetModel.prototype = maria.create(maria.SetModel.prototype);
            app.PeopleSetModel.prototype.constructor = app.PeopleSetModel;
            app.PeopleSetModel.prototype.getDefaultElementConstructor = function () {
                return app.PersonModel;
            };
            app.PeopleSetModel.fromJSON = function (json) {
                return maria.SetModel.fromJSON.call(this, json);
            };

            var people = app.PeopleSetModel.fromJSON([{name: 'Sgt Baker'}, {name: 'Mr Krinkle'}]);
            var result = people.toArray().sort(function (a, b) {
                return (a.getName() < b.getName()) ?
                           -1 :
                           (a.getName() > b.getName()) ?
                               1:
                               0;
            });
            assert.same(2, result.length);
            assert.same('Mr Krinkle', result[0].getName());
            assert.same('Sgt Baker', result[1].getName());
        }

    });

}());
