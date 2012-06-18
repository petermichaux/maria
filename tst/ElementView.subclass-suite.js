(function() {

    buster.testCase('ElementView.subclass Suite', {

        "test template sugar": function() {
            var app = {};
            var template = '<span>the template</span>';
            maria.ElementView.subclass(app, 'Alpha', {
                template: template
            });
            assert.same(template, app.Alpha.prototype.getTemplate());
        },

        "test templateName sugar": function() {
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

        "test subclass UI actions sugar": function() {
            var app = {};
            var uiActions = {};
            maria.ElementView.subclass(app, 'Alpha', {
                uiActions: uiActions
            });
            assert.same(uiActions, app.Alpha.prototype.getUIActions());
        },

        "test uiActions property prefered over uiActions": function() {
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
        }

    });

}());
