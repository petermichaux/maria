timeit.isCanvasSupported = function(doc) {
    doc = doc || document
    var el = doc.createElement('canvas');
    return (typeof el.getContext === 'function') && 
           (typeof el.getContext('2d') === 'object');
};
