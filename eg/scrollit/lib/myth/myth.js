// a fake XHR library for the purposes of the demo to simulate server responses.

var myth = myth || {};

(function () {

    // build up the artificial data
    function randomXToY(minVal, maxVal) {
      return Math.round(minVal + (Math.random() * (maxVal - minVal)));
    }

    function makePrice() {
        return randomXToY(1, 10000) / 100;
    }

    var products = [
        "apple",
        "orange",
        "banana",
        "pineapple",
        "mango",
        "blackberry",
        "macadamia",
        "onion",
        "lemon",
        "dragonfruit",
        "jackfruit",
        "lychee",
        "parsnip",
        "celery",
        "peach",
        "jujube",
        "carrot",
        "raspberry",
        "acorn",
        "papaya",
        "mangosteen",
        "nectarine",
        "guava",
        "lingonberry",
        "pomegranate",
        "cascade berry",
        "lime",
        "potato",
        "cucumber",
        "persimmon",
        "blueberry",
        "hazelnut",
        "almond",
        "olive",
        "grapefruit",
        "cherimoya",
        "date",
        "prickly pear",
        "quince",
        "sapote",
        "currant",
        "oregon grape",
        "tangerine",
        "feijoa",
        "honeydue",
        "brazil nut",
        "tomato",
        "pecan",
        "salmonberry",
        "loganberry",
        "strawberry",
        "saskatoonberry",
        "fig",
        "sesame seed",
        "pumpkin",
        "mandarine",
        "mulberry",
        "apricot",
        "cashew",
        "kiwi",
        "chestnut",
        "clementine",
        "watermelon",
        "elderberry",
        "walnut",
        "gooseberry",
        "peanut",
        "kumquat",
        "pear",
        "rhubarb",
        "huckleberry",
        "pine nut",
        "kola nut",
        "cantaloupe",
        "tamarind",
        "cranberry",
        "grape",
        "bell pepper",
        "plantain",
        "zucchini",
        "coconut",
        "loquat",
        "durian",
        "avocado",
        "kiwano",
        "pistachio",
        "star fruit",
        "sapodillas",
        "cherry",
        "olallieberries",
        "crenshaw melon",
        "rambutan",
        "boysenberry",
        "mushroom",
        "eggplant",
        "walnut",
        "asparagus",
        "peas",
        "beans",
        "plum"
    ];

    for (var i = 0, ilen = products.length; i < ilen; i++) {
        var name = products[i];
        products[i] = {
            id: i,
            name: name,
            price: makePrice()
        };
    }

    myth.xhr = function (method, url, options) {
        options = options || {};

        setTimeout(function () {

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
