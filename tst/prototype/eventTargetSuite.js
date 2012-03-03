var eventTargetSuite;

(function() {

    // BEGIN some interesting objects to play with.

    var tweet1 = 'Great sandwich!';
    var tweet1b = '@bar hey!';
    var tweet2 = 'So tired!';
    var tweet3 = 'Homework sucks!';
    var tweet4 = 'No thoughts lately.';
    var tweet5 = 'My last tweet ever. Bye-bye.';

    var feed1;
    var feed1b;
    var feed2;
    var feed3;
    var feed4;
    var feedAll;

    var listener1 = function(data) {
        feed1.push(data.tweet);
    };

    var listener1b = function(data) {
        feed1b.push(data.tweet);
    };

    var listener2 = function(data) {
        feed2.push(data.tweet);
    };

    var listener3 = function(data) {
        feed3.push(data.tweet);
    };

    var listener4 = function(data) {
        feed4.push(data.tweet);
    };
    
    var listenerAll = function(data) {
        feedAll.push(data.tweet);
    };

    var twitter = new LIB_EventTarget();

    function APP_Twitter(name) {
        this.name = name;
    };
    LIB_mixinEventTarget(APP_Twitter.prototype);

    var tweetsRUs = new APP_Twitter('Tweets R Us');

    // END some interesting objects to play with.


    eventTargetSuite = {
        suiteName: 'eventTargetSuite',

        setUp: function() {
            // clear the feeds
            feed1 = [];
            feed1b = [];
            feed2 = [];
            feed3 = [];
            feed4 = [];
            feedAll = [];

            // add some listeners
            LIB_EventTarget.prototype.addEventListener('foo', listener1);
            LIB_EventTarget.prototype.addEventListener('bar', listener1b);
            LIB_EventTarget.prototype.addEventListener('LIB_all', listenerAll);
            twitter.addEventListener('foo', listener2);
            tweetsRUs.addEventListener('foo', listener3);
            APP_Twitter.prototype.addEventListener('foo', listener4);

            // send some tweets
            LIB_EventTarget.prototype.dispatchEvent({
                type: 'foo',
                tweet: tweet1
            });

            LIB_EventTarget.prototype.dispatchEvent({
                type: 'bar',
                tweet: tweet1b
            });

            twitter.dispatchEvent({
                type: 'foo',
                tweet: tweet2
            });

            tweetsRUs.dispatchEvent({
                type: 'foo',
                tweet: tweet3
            });

            APP_Twitter.prototype.dispatchEvent({
                type: 'foo',
                tweet: tweet4
            });

            APP_Twitter.prototype.dispatchEvent({
                type: 'foo',
                tweet: tweet5
            });

        },

        tearDown: function() {
            // remove the listeners
            LIB_EventTarget.prototype.removeEventListener('foo', listener1);
            LIB_EventTarget.prototype.removeEventListener('bar', listener1b);
            LIB_EventTarget.prototype.removeEventListener('LIB_all', listenerAll);
            twitter.removeEventListener('foo', listener2);
            tweetsRUs.removeEventListener('foo', listener3);
            APP_Twitter.prototype.removeEventListener('foo', listener4);
        },

        "test LIB_EventTarget.prototype constructor": function() {
            jsUnity.assertIdentical(LIB_EventTarget, LIB_EventTarget.prototype.constructor, "LIB_EventTarget.prototype's constructor should be Object.");
        },

        "test LIB_EventTarget instance's constructor": function() {
            jsUnity.assertIdentical(LIB_EventTarget, LIB_EventTarget.prototype.constructor, "LIB_EventTarget.prototype should have Object as its constructor.");
            jsUnity.assertIdentical(LIB_EventTarget, (new LIB_EventTarget()).constructor, "an instance of LIB_EventTarget should have LIB_EventTarget as its constructor.");
        },

        "test LIB_mixinEventTarget does not change constructor": function() {
            function F() {}
            var obj = new F();
            var constructorBefore = obj.constructor;
            jsUnity.assertIdentical(F, constructorBefore, "sanity check");
            LIB_mixinEventTarget(obj);
            jsUnity.assertIdentical(constructorBefore, obj.constructor, "the constructor should not have changed");
        },

        "test event lists of listeners are separate for one subject": function() {
            jsUnity.assertArrayIdentical([tweet1], feed1);
            jsUnity.assertArrayIdentical([tweet1b], feed1b);
        },

        "test lists of listeners for same event are separate for multiple subjects": function() {
            jsUnity.assertArrayIdentical([tweet1], feed1);
            jsUnity.assertArrayIdentical([tweet2], feed2);
            jsUnity.assertArrayIdentical([tweet3], feed3);
            jsUnity.assertArrayIdentical([tweet4, tweet5], feed4);
        },

        "test all listeners": function() {
            jsUnity.assertArrayIdentical([tweet1, tweet1b], feedAll);
        },

        "test methodName argument": function() {
            var s = new LIB_EventTarget();
            var obj0 = {
                name: 'obj0_name',
                handler: function(ev) {
                    this.result = this.name;
                }
            };
            s.addEventListener('foo', obj0, 'handler');

            jsUnity.assertIdentical(undefined, obj0.result);

            s.dispatchEvent({type: 'foo'});

            jsUnity.assertIdentical('obj0_name', obj0.result);
            
            delete obj0.result;

            jsUnity.assertIdentical(undefined, obj0.result);

            s.removeEventListener('foo', obj0, 'handler');

            s.dispatchEvent({type: 'foo'});

            jsUnity.assertIdentical(undefined, obj0.result);
        },

        "test implements": function() {
            jsUnity.assertIdentical(false, LIB_implementsEventTarget({}), 'basic objects should not implement the subject interface.');
            jsUnity.assertIdentical(true, LIB_implementsEventTarget(new LIB_EventTarget()), 'subject objects should implement the subject interface.');
        },

        "test that target doesn't change and that currentTarget does change when bubbling": function() {

            var child0 = new LIB_EventTarget();
            var child1 = new LIB_EventTarget();

            var result0;
            var result1;

            child0.addEventListener('foo', function(ev) {
                result0 = ev;
                // bubble the event
                child1.dispatchEvent(ev);
            });

            child1.addEventListener('foo', function(ev) {
                result1 = ev;
            });

            child0.dispatchEvent({type:'foo'});

            jsUnity.assertIdentical(result0.target, child0, 'assertion 1: The target should be child0.');
            jsUnity.assertIdentical(result0.currentTarget, child0, 'assertion 2: The currentTarget should be child0.');
            jsUnity.assertIdentical(result1.target, child0, 'assertion 3: The target should be child0.');
            jsUnity.assertIdentical(result1.currentTarget, child1, 'assertion 4: The currentTarget should be child1.');

        },

        "test that bubbling while handling an event does not alter the original event": function() {

            var child0 = new LIB_EventTarget();
            var child1 = new LIB_EventTarget();
            var child2 = new LIB_EventTarget();

            var result0;
            var result1;
            var result2;

            child0.addEventListener('foo', function(ev) {
                result0 = ev;
            });

            child0.addEventListener('foo', function(ev) {
                child1.dispatchEvent(ev);
                result1 = ev;
            });

            child1.addEventListener('foo', function(ev) {
                result2 = ev;
            });

            child0.dispatchEvent({type:'foo'});

            jsUnity.assertIdentical(result0.target, child0, 'assertion 1: The target should be child0.');
            jsUnity.assertIdentical(result0.currentTarget, child0, 'assertion 2: The currentTarget should be child0.');
            jsUnity.assertIdentical(result1.target, child0, 'assertion 3: The target should be child0.');
            jsUnity.assertIdentical(result1.currentTarget, child0, 'assertion 4: The currentTarget should be child0.');
            jsUnity.assertIdentical(result2.target, child0, 'assertion 5: The target should be child0.');
            jsUnity.assertIdentical(result2.currentTarget, child1, 'assertion 6: The currentTarget should be child1.');

        }

    };

}());
