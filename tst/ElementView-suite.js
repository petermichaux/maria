(function () {

    buster.testCase('ElementView Suite', {

        "test ElementView has superConstructor View": function () {
            assert.same(maria.View, maria.ElementView.superConstructor);
        },

        "test calling constructor with parameters sets them in new instance": function () {
            var model = new maria.Model();
            var controller = new maria.Controller();
            var doc = {};
            var elementView = new maria.ElementView(model, controller, doc);
            assert.same(model, elementView.getModel(), 'model should be same');
            assert.same(controller, elementView.getController(), 'controller should be same');
            assert.same(doc, elementView.getDocument(), 'document should be same');
        },

        "test calling constructor with only model parameter sets it and controller and document are defaults": function () {
            var model = new maria.Model();
            var elementView = new maria.ElementView(model);
            assert.same(model, elementView.getModel(), 'model should be same');
            assert.same(maria.Controller, elementView.getController().constructor, 'controller should be default');
            assert.same(document, elementView.getDocument(), 'document should be default');
        },

        "test calling constructor with only controller parameter sets it and model and document are defaults": function () {
            var controller = new maria.Controller();
            var elementView = new maria.ElementView(null, controller);
            assert.same(null, elementView.getModel(), 'model should be null by default');
            assert.same(controller, elementView.getController(), 'controller should be same');
            assert.same(document, elementView.getDocument(), 'document should be default');
        },

        "test calling constructor with only document parameter sets it and model and controller are defaults": function () {
            var doc = {};
            var elementView = new maria.ElementView(null, null, doc);
            assert.same(null, elementView.getModel(), 'model should be null default');
            assert.same(maria.Controller, elementView.getController().constructor, 'controller should be default');
            assert.same(doc, elementView.getDocument(), 'document should be same');
        },

        "test default template is for a simple empty div element": function () {
            var elementView = new maria.ElementView();
            assert.same('<div></div>', elementView.getTemplate());
        },

        "test default UI actions are empty": function () {
            var elementView = new maria.ElementView();
            var count = 0;
            var uiActions = elementView.getUIActions();
            for (var p in uiActions) {
                if (Object.prototype.hasOwnProperty.call(uiActions, p)) {
                    count++;
                }
            }
            assert.same(0, count, 'there should be zero ui actions by default');
        },

        "test when UI actions are not empty then listeners are added": function () {
            var elementView = new maria.ElementView();
            elementView.getTemplate = function () {
                return '<div class="abc"><span></span><span></span></div>';
            };
            elementView.getUIActions = function () {
                return {
                    'click div'     : 'onClickDiv'    ,
                    'mouseover .abc': 'onMouseoverDiv',
                    'dblclick span' : 'onDblclickSpan'
                };
            };

            var args = [];

            var originalOn = maria.on;
            maria.on = function (node, eventType, listener, methodName) {
                args.push({
                    node: node,
                    eventType: eventType,
                    listener: listener,
                    methodName: methodName
                });
            };

            // next line will trigger creation of DOM node and addition of listeners.
            elementView.build();

            assert.same(4, args.length, 'maria.on should have been called four times');

            // need a predictable order to test
            args.sort(function (a, b) {
                return a.methodName > b.methodName ?
                           1 :
                           a.methodName < b.methodName ?
                               -1 :
                               0;
            });

            assert.same(elementView.build(), args[0].node);
            assert.same('click', args[0].eventType);
            assert.same(elementView, args[0].listener);
            assert.same('onClickDiv', args[0].methodName);

            assert.same('SPAN', args[1].node.tagName);
            assert.same('dblclick', args[1].eventType);
            assert.same(elementView, args[1].listener);
            assert.same('onDblclickSpan', args[1].methodName);

            assert.same('SPAN', args[2].node.tagName);
            assert.same('dblclick', args[2].eventType);
            assert.same(elementView, args[2].listener);
            assert.same('onDblclickSpan', args[2].methodName);

            // don't know the order of the spans just tested but they must be different
            refute.same(args[1].node, args[2].node);

            assert.same(elementView.build(), args[3].node);
            assert.same('mouseover', args[3].eventType);
            assert.same(elementView, args[3].listener);
            assert.same('onMouseoverDiv', args[3].methodName);

            maria.on = originalOn;
        },

        "test build returns a DOM node": function () {
            var elementView = new maria.ElementView();
            var rootEl = elementView.build();
            assert.same('DIV', rootEl.tagName);
        },

        "test by default the containerEl for children is the rootEl": function () {
            var elementView = new maria.ElementView();
            assert.same(elementView.build(), elementView.getContainerEl());
        },

        "test appending a sub-view appends the sub-view's DOM node": function () {
            var parent = new maria.ElementView();
            var child = new maria.ElementView();
            parent.appendChild(child);
            assert.same(child.build(), parent.build().firstChild);
        },

        "test inserting a sub-view inserts the sub-view's DOM node": function () {
            var parent = new maria.ElementView();
            var child0 = new maria.ElementView();
            var child1 = new maria.ElementView();
            var child2 = new maria.ElementView();
            parent.appendChild(child0);
            parent.appendChild(child2);
            assert.same(child0.build(), parent.build().firstChild);
            assert.same(child2.build(), parent.build().lastChild);
            parent.insertBefore(child1, child2);
            assert.same(child1.build(), parent.build().firstChild.nextSibling);
        },

        "test removing a sub-view removes the sub-view's DOM node": function () {
            var parent = new maria.ElementView();
            var child0 = new maria.ElementView();
            var child1 = new maria.ElementView();
            var child2 = new maria.ElementView();
            parent.appendChild(child0);
            parent.appendChild(child1);
            parent.appendChild(child2);
            assert.same(child0.build(), parent.build().firstChild);
            assert.same(child1.build(), parent.build().firstChild.nextSibling);
            assert.same(child2.build(), parent.build().lastChild);
            parent.removeChild(child1);
            assert.same(child0.build(), parent.build().firstChild);
            assert.same(child2.build(), parent.build().firstChild.nextSibling);
            assert.same(child2.build(), parent.build().lastChild);
        },

        "test find can find the root element div": function () {
            var elementView = new maria.ElementView();
            var foundDiv = elementView.find('div');
            assert.same(elementView.build(), foundDiv);
        },

        "test findAll can find the root element div": function () {
            var elementView = new maria.ElementView();
            var foundDivs = elementView.findAll('div');
            assert.isArray(foundDivs, 'foundDivs should be an array');
            assert.same(1, foundDivs.length, 'there should only be one div found');
            assert.same(elementView.build(), foundDivs[0]);
        }

    });

}());
