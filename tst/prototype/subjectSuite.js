var subjectSuite = {
    suiteName: 'subjectSuite',

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
    }

};
