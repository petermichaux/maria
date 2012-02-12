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

            // add some listeners
            LIB_subject.addEventListener('foo', listener1);
            LIB_subject.addEventListener('bar', listener1b);
            twitter.addEventListener('foo', listener2);
            tweetsRUs.addEventListener('foo', listener3);
            APP_Twitter.prototype.addEventListener('foo', listener4);

            // send some tweets
            LIB_subject.dispatchEvent({
                type: 'foo',
                tweet: tweet1
            });

            LIB_subject.dispatchEvent({
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
            LIB_subject.removeEventListener('foo', listener1);
            LIB_subject.removeEventListener('bar', listener1b);
            twitter.removeEventListener('foo', listener2);
            tweetsRUs.removeEventListener('foo', listener3);
            APP_Twitter.prototype.removeEventListener('foo', listener4);
        },

        "test LIB_subject constructor": function() {
            jsUnity.assertIdentical(Object, LIB_subject.constructor, "LIB_subject's constructor should be Object.");
        },

        "test LIB_Subject instance's constructor": function() {
            jsUnity.assertIdentical(Object, LIB_Subject.prototype.constructor, "LIB_Subject.prototype should have Object as its constructor.");
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
        }

    };

}());
