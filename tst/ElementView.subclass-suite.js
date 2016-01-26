(function() {

    buster.testCase('ElementView.subclass Suite', {

        "test subclass superConstructor": function() {
            var app = {};
            maria.ElementView.subclass(app, 'MyElementView');
            assert.same(maria.ElementView, app.MyElementView.superConstructor);
        },

        "test template convention sugar": function() {
            var alphaTemplate = 'abc';
            var app = {
                'AlphaTemplate': alphaTemplate
            };
            maria.ElementView.subclass(app, 'AlphaView');
            assert.same(alphaTemplate, app.AlphaView.prototype.getTemplate());
        },

        "test template property sugar": function() {
            var app = {};
            var template = '<span>the template</span>';
            maria.ElementView.subclass(app, 'Alpha', {
                template: template
            });
            assert.same(template, app.Alpha.prototype.getTemplate());
        },

        "test templateName property sugar": function() {
            var app = {
                'myTemplate': '<ul class="test-ul-template"></ul>'
            };
            maria.ElementView.subclass(app, 'Alpha', {
                templateName: 'myTemplate'
            });
            assert.same(app.myTemplate, app.Alpha.prototype.getTemplate());
        },

        "test getTemplate property prefered over template and templateName": function() {
            var app = {
                'myTemplate': '<ul class="test-ul-template"></ul>'
            };
            var template = '<span>the template</span>';
            var pTemplate = '<p></p>';
            maria.ElementView.subclass(app, 'Alpha', {
                template: template,
                templateName: 'myTemplate',
                properties: {
                    getTemplate: function() {
                        return pTemplate;
                    }
                }
            });
            assert.same(pTemplate, app.Alpha.prototype.getTemplate());
        },

        "test template prefered over templateName": function() {
            var app = {
                'myTemplate': '<ul class="test-ul-template"></ul>'
            };
            var template = '<span>the template</span>';
            maria.ElementView.subclass(app, 'Alpha', {
                template: template,
                templateName: 'myTemplate'
            });
            assert.same(template, app.Alpha.prototype.getTemplate());
        },

        "test removeChild removes child root DOM element": function() {
            var app = {
                AlphaTemplate: '<div class="Alpha"><div class="aContainer"></div></div>',
                BetaTemplate: '<div class="Beta"></div>'
            };
            maria.ElementView.subclass(app, 'AlphaView', {
                properties: {
                    buildChildViews: function() {
                        // NOTE do not add to the same element returned by getContainerEl
                        this.build().appendChild(this.childNodes[0].build());
                    },
                    getContainerEl: function() {
                        return this.find('.aContainer');
                    }
                }
            });
            maria.ElementView.subclass(app, 'BetaView');
            var alphaView = new app.AlphaView();
            var betaView = new app.BetaView();
            alphaView.appendChild(betaView);
            assert.same(betaView, alphaView.childNodes[0]);
            assert.same(betaView.build().className, alphaView.build().firstChild.nextSibling.className);
            alphaView.removeChild(betaView);
            assert.same(0, alphaView.childNodes.length);
            assert.same(betaView.parentNode, null);
            // It would be best to check that betaView.build().parentNode is null
            // however IE8- does not set the parentNode to null after removing
            // an element from its parent.
            //
            // http://cjwainwright.co.uk/webdev/ie8removechild/
            //
            // One day when IE8- do not matter, change the following if-else to just
            //
            //     assert.same(betaView.build().parentNode, null);
            //
            if (betaView.build().parentNode === null) {
                assert.same(betaView.build().parentNode, null);
            }
            else {
                refute.same(betaView.build().parentNode, alphaView.build());
            }
        },

        "test subclass UI actions sugar": function() {
            var app = {};
            var uiActions = {};
            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: uiActions
            });
            assert.same(uiActions, app.Alpha.prototype.getUIActions());
        },

        "test getUIActions property prefered over uiActions": function() {
            var app = {};
            var uiActions0 = {};
            var uiActions1 = {};
            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: uiActions1,
                properties: {
                    getUIActions: function() {
                        return uiActions0;
                    }
                }
            });
            assert.same(uiActions0, app.Alpha.prototype.getUIActions());
        },

        "test subclass UI actions sugar inherits superclass UI actions": function() {
            var foo, bar,
                app = {};

            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: {
                    'click div': 'onClickDiv',
                    'mouseover div': 'onMouseoverDiv',
                    'mousemove div': 'onMousemoveDiv'
                }
            });

            app.Alpha.subclass(app, 'Beta', {
                moreUIActions: {
                    'dblclick div': 'onDblClickDiv',
                    'mouseup div': 'onMouseupDiv',
                    'mousemove div': 'onMousemoveOverwritten'
                }
            });

            foo = new app.Alpha();
            bar = new app.Beta();

            assert.equals(foo.getUIActions(), {
                'click div': 'onClickDiv',
                'mouseover div': 'onMouseoverDiv',
                'mousemove div': 'onMousemoveDiv'
            });

            assert.equals(bar.getUIActions(), {
                'click div': 'onClickDiv',
                'mouseover div': 'onMouseoverDiv',
                'dblclick div': 'onDblClickDiv',
                'mouseup div': 'onMouseupDiv',
                'mousemove div': 'onMousemoveOverwritten'
            });
        },

        "test dynamically changing superclass affect on subclass UI actions": function() {
            var foo, bar,
                app = {};

            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: {
                    'click div': 'onClickDiv'
                }
            });

            app.Alpha.subclass(app, 'Beta', {
                moreUIActions: {
                    'dblclick div': 'onDblClickDiv'
                }
            });

            foo = new app.Alpha();
            bar = new app.Beta();

            assert.equals(bar.getUIActions(), {
                'click div': 'onClickDiv',
                'dblclick div': 'onDblClickDiv'
            });

            app.Alpha.prototype.getUIActions = function () {
                return {
                    'click div': 'onClickOverwritten',
                    'mouseover div': 'onMouseoverDiv'
                };
            };

            assert.equals(bar.getUIActions(), {
                'click div': 'onClickOverwritten',
                'dblclick div': 'onDblClickDiv',
                'mouseover div': 'onMouseoverDiv'
            });
        },

        "test subclass UI actions sugar creates handler functions": function() {
            var app = {};
            var uiActions = {
                'click div'    : 'onClickDiv'    ,
                'mouseover div': 'onMouseoverDiv'
            };
            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: uiActions
            });
            assert.isFunction(app.Alpha.prototype.onClickDiv);
            assert.isFunction(app.Alpha.prototype.onMouseoverDiv);
        },

        "test handler function property prefered over autocreated handler function": function() {
            var app = {};
            var uiActions = {
                'click div'    : 'onClickDiv'    ,
                'mouseover div': 'onMouseoverDiv'
            };
            var onClickDiv = function() {};
            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: uiActions,
                properties: {
                    onClickDiv: onClickDiv
                }
            });
            assert.same(onClickDiv, app.Alpha.prototype.onClickDiv);
        },

        "test autocreated handler functions delegate to controller method of the same name": function() {
            var evt = {};
            var calledEvt;
            var controller = {
                onClickDiv: function(evt) {
                    calledEvt = evt;
                },
                setView: function() {},
                setModel: function() {}
            };
            var app = {};
            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: {
                    'click div': 'onClickDiv'
                },
                properties: {
                    getDefaultController: function() {
                        return controller;
                    }
                }
            });

            app.Alpha.prototype.onClickDiv(evt);
            assert.same(evt, calledEvt);
        },

        "test inheritied ui action is called rather than one generated": function() {

            var app = {};

            var wasSquishedFromAlpha = false;
            var wasSquishedFromGamma = false;
            var wasSquashed = false;

            maria.Controller.subclass(app, 'GammaController', {
                properties: {
                    onSquishedFromAlpha: function() {
                        wasSquishedFromAlpha = true;
                    },
                    onSquished: function() {
                        wasSquishedFromGamma = true;
                    },
                    onSquashed: function() {
                        wasSquashed = true;
                    }
                }
            });

            var handler = function() {
                this.getController().onSquishedFromAlpha();
            };

            maria.ElementView.subclass(app, 'AlphaView', {
                properties: {
                    onSquished: handler
                }
            });

            app.AlphaView.subclass(app, 'BetaView', {});

            app.BetaView.subclass(app, 'GammaView', {
                uiActions: {
                    'click .asdf': 'onSquished',
                    'click .qwerty': 'onSquashed'
                }
            });

            var gammaView = new app.GammaView();

            assert.equals(handler, gammaView.onSquished, 'the gammaView.onSquished handler should be inheritied from app.AlphaView.prototype.onSquished. An app.GammaView.prototype.onSquished method should not have been auto generated.');

            // The following two checks are actually redundant. The above on check is sufficient.
            // I want to have the following two checks to be doubly sure the whole system all the way
            // to the controller is tested as working correctly.

            gammaView.onSquished();

            assert.equals(true, wasSquishedFromAlpha, 'wasSquishedFromAlpha should be true because the inheritied app.AlphaView.prototype.onSquished method should have been used.');

            assert.equals(false, wasSquishedFromGamma, 'wasSquishedFromGamma should be false because no generated app.GammaView.prototype.onSquished method should have been generated.');

            // check that other non-inherited handlers are still generated even when some handlers are inherited

            assert.equals(true, Object.prototype.hasOwnProperty.call(app.GammaView.prototype, 'onSquashed'), 'an app.BetaView.prototype.onSquashed property should have been generated');

            assert.isFunction(app.GammaView.prototype.onSquashed, 'app.BetaView.prototype.onSquashed should be a function');
            assert.equals(false, wasSquashed, 'wasSquashed should still be false at this point.');
            gammaView.onSquashed();
            assert.equals(true, wasSquashed, 'wasSquashed should be true now that gammaView.onSquashed was called.');

        }

    });

}());
