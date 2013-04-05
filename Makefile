.PHONY: all clean cleaner

LIBS_MIN   = lib/evento/evento-min.js      \
             lib/hijos/hijos-min.js        \
             lib/arbutus/arbutus-min.js    \
             lib/grail/grail-min.js        \
             lib/hormigas/hormigas-min.js

LIBS       = lib/evento/evento.js          \
             lib/hijos/hijos.js            \
             lib/arbutus/arbutus.js        \
             lib/grail/grail.js            \
             lib/hormigas/hormigas.js

SRCS       = src/header.js                 \
             src/namespace.js              \
             src/create.js                 \
             src/borrow.js                 \
             src/subclass.js               \
             src/borrowEvento.js           \
             src/Model.js                  \
             src/SetModel.js               \
             src/View.js                   \
             src/ElementView.js            \
             src/SetView.js                \
             src/Controller.js             \
             src/Model.subclass.js         \
             src/SetModel.subclass.js      \
             src/View.subclass.js          \
             src/ElementView.subclass.js   \
             src/SetView.subclass.js       \
             src/Controller.subclass.js

all: build/maria.js build/maria-min.js

build/maria.js: $(LIBS) $(SRCS)
	mkdir -p build
	cat $(LIBS) $(SRCS) >build/maria.js

build/maria-min.js: $(LIBS_MIN) $(SRCS) compiler.jar
	mkdir -p build tmp
	cat $(SRCS) >tmp/maria-tmp1.js
	java -jar compiler.jar --js tmp/maria-tmp1.js --js_output_file tmp/maria-tmp2.js
	cat $(LIBS_MIN) src/header.js tmp/maria-tmp2.js >build/maria-min.js

compiler.jar:
	mkdir -p tmp
	cd tmp && \
	curl -O http://closure-compiler.googlecode.com/files/compiler-latest.zip && \
	unzip compiler-latest.zip && \
	mv compiler.jar ..

clean:
	rm -rf build tmp

cleaner: clean
	rm -f compiler.jar
