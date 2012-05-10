.PHONY: clean

LIBS_MIN = lib/evento/evento-min.js  \
           lib/hijos/hijos-min.js    \
           lib/abeja/abeja-min.js    \
           lib/grail/grail-min.js

LIBS = lib/evento/evento.js          \
       lib/hijos/hijos.js            \
       lib/abeja/abeja.js            \
       lib/grail/grail.js

SRCS = src/header.js                 \
       src/namespace.js              \
       src/subclass.js               \
       src/borrow.js                 \
       src/borrowEvento.js           \
       src/borrowHijos.js            \
       src/borrowAbeja.js            \
       src/borrowGrail.js            \
       src/Set.js                    \
       src/Model.js                  \
       src/Model.subclass.js         \
       src/SetModel.js               \
       src/SetModel.subclass.js      \
       src/View.js                   \
       src/View.subclass.js          \
       src/ElementView.js            \
       src/ElementView.subclass.js   \
       src/SetView.js                \
       src/SetView.subclass.js       \
       src/Controller.js             \
       src/Controller.subclass.js

build: $(LIBS_MIN) $(LIBS) $(SRCS)
	mkdir -p build
	cat $(LIBS) $(SRCS) >build/maria.js
	cat $(SRCS) >build/maria-tmp1.js
	jsmin <build/maria-tmp1.js >build/maria-tmp2.js
	rm build/maria-tmp1.js
	cat $(LIBS_MIN) src/header.js build/maria-tmp2.js >build/maria-min.js
	rm build/maria-tmp2.js

clean:
	rm -rf build
