// a fake XHR library for the purposes of the demo to simulate server responses.

var myth = myth || {};

(function() {

    // build up the artificial data
    function randomXToY(minVal, maxVal) {
      return Math.round(minVal + (Math.random() * (maxVal - minVal)));
    }
    
    function makeName() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var length = randomXToY(5, 10);
        for (var i = 0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    
    function makePrice() {
        return randomXToY(1, 10000) / 100;
    }
    
    var products = [];
    for (var i = 0; i < 100; i++) {
        products.push({
            id: i,
            name: makeName(),
            price: makePrice()
        });
    }

    myth.xhr = function(method, url, options) {
        options = options || {};

        setTimeout(function() {

            if (method === 'GET' && /^\/products\.json/.test(url)) {
                var matches = url.match(/offset\=(\d+)/);
                var offset = matches ? parseInt(matches[1], 10) : 0;
                var result;
                var count = 25;
                if (offset >= products.length) {
                    result = [];
                }
                else {
                    if (offset + count > products.length) {
                        count = products.length - offset;
                    }
                    result = products.slice(offset, offset + count);
                }
                options.on200({
                    responseText: JSON.stringify(result)
                });
            }
            else {
                throw new Error('unsupported');
            }

        }, 2000);

    };

}());
