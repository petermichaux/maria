var subjectSuite;

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

    var twitter = new LIB_Subject();

    function APP_Twitter(name) {
        this.name = name;
    };
    LIB_mixinSubject(APP_Twitter.prototype);

    var tweetsRUs = new APP_Twitter('Tweets R Us');

    // END some interesting objects to play with.


    subjectSuite = {
        suiteName: 'subjectSuite',

        setUp: function() {
            // clear the feeds
            feed1 = [];
            feed1b = [];
            feed2 = [];
            feed3 = [];
            feed4 = [];
            feedAll = [];

            // add some listeners
            LIB_Subject.prototype.addEventListener('foo', listener1);
            LIB_Subject.prototype.addEventListener('bar', listener1b);
            LIB_Subject.prototype.addEventListener('LIB_all', listenerAll);
            twitter.addEventListener('foo', listener2);
            tweetsRUs.addEventListener('foo', listener3);
            APP_Twitter.prototype.addEventListener('foo', listener4);

            // send some tweets
            LIB_Subject.prototype.dispatchEvent({
                type: 'foo',
                tweet: tweet1
            });

            LIB_Subject.prototype.dispatchEvent({
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
            LIB_Subject.prototype.removeEventListener('foo', listener1);
            LIB_Subject.prototype.removeEventListener('bar', listener1b);
            LIB_Subject.prototype.removeEventListener('LIB_all', listenerAll);
            twitter.removeEventListener('foo', listener2);
            tweetsRUs.removeEventListener('foo', listener3);
            APP_Twitter.prototype.removeEventListener('foo', listener4);
        },

        "test LIB_Subject.prototype constructor": function() {
            jsUnity.assertIdentical(LIB_Subject, LIB_Subject.prototype.constructor, "LIB_Subject.prototype's constructor should be Object.");
        },

        "test LIB_Subject instance's constructor": function() {
            jsUnity.assertIdentical(LIB_Subject, LIB_Subject.prototype.constructor, "LIB_Subject.prototype should have Object as its constructor.");
            jsUnity.assertIdentical(LIB_Subject, (new LIB_Subject()).constructor, "an instance of LIB_Subject should have LIB_Subject as its constructor.");
        },

        "test LIB_mixinSubject does not change constructor": function() {
            function F() {}
            var obj = new F();
            var constructorBefore = obj.constructor;
            jsUnity.assertIdentical(F, constructorBefore, "sanity check");
            LIB_mixinSubject(obj);
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

        "test thisObj argument": function() {
            var s = new LIB_Subject();
            var obj0 = {
                name: 'obj0_name',
                handler: function(ev) {
                    this.result = this.name;
                }
            };
            var obj1 = {
                name: 'obj1_name'
            };
            s.addEventListener('foo', obj0.handler, obj0);
            // borrow obj0's handler and use for obj1
            s.addEventListener('foo', obj0.handler, obj1);

            jsUnity.assertIdentical(undefined, obj0.result);
            jsUnity.assertIdentical(undefined, obj1.result);

            s.dispatchEvent({type: 'foo'});

            jsUnity.assertIdentical('obj0_name', obj0.result);
            jsUnity.assertIdentical('obj1_name', obj1.result);
            
            delete obj0.result;
            delete obj1.result;

            jsUnity.assertIdentical(undefined, obj0.result);
            jsUnity.assertIdentical(undefined, obj1.result);

            s.removeEventListener('foo', obj0.handler, obj1);
            s.dispatchEvent({type: 'foo'});

            jsUnity.assertIdentical('obj0_name', obj0.result);
            jsUnity.assertIdentical(undefined, obj1.result);

        }

    };

}());
