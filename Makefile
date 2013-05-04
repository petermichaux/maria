.PHONY: all clean cleaner deploy-www

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
             src/borrowHijos.js            \
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

all: build/dist build/dist/maria-min.js build/www

build/dist: build/dist/README.md build/dist/LICENSE build/dist/maria.js build/dist/maria-min.js build/dist/maria-amd.js

build/dist/README.md: README.md
	mkdir -p build/dist
	cp README.md build/dist/README.md

build/dist/LICENSE: LICENSE
	mkdir -p build/dist
	cp LICENSE build/dist/LICENSE

tmp/maria-raw.js: $(LIBS) $(SRCS)
	mkdir -p build/dist tmp
	cat $(LIBS) $(SRCS) >tmp/maria-raw.js

build/dist/maria.js: tmp/maria-raw.js
	mkdir -p build/dist
	echo "var maria = (function() { // IIFE" > build/dist/maria.js
	cat tmp/maria-raw.js >> build/dist/maria.js
	echo "\nreturn maria;}()); // IIFE" >> build/dist/maria.js
	gzip --best -c build/dist/maria.js > build/dist/maria.js.gz

build/dist/maria-min.js: build/dist/maria.js lib/compiler
	mkdir -p build/dist tmp
	cd build/dist && java -jar ../../lib/compiler/compiler.jar --js maria.js --js_output_file maria-min.js --create_source_map maria-min.map --source_map_format V3
	echo "/*\n//@ sourceMappingURL=maria-min.map\n*/\n" >> build/dist/maria-min.js
	gzip --best -c build/dist/maria-min.js > build/dist/maria-min.js.gz

build/dist/maria-amd.js: tmp/maria-raw.js
	echo "define(function() { // AMD" > build/dist/maria-amd.js
	cat tmp/maria-raw.js >> build/dist/maria-amd.js
	echo "\nreturn maria;}); // AMD" >> build/dist/maria-amd.js

deploy-www: build/www
	scp -r build/www/* peter@michaux.ca:~/sites/maria

build/www: build/www/eg build/www/api doc/* doc/*/* doc/*/*/* doc/*/*/* doc/*/*/*/* doc/*/*/*/*/*
	mkdir -p build/www
	touch build/www
	cp -R doc/* build/www

# Need to make the file tmp/maria.js as the input source code used by JSDoc
# for three reasons:
#
# The real build/dist/maria.js is wrapped in an IIFE and using that file as the source
# that JSDoc processes makes JSDoc unable to produce HTML documentation with
# the appropriate filenames. For example, the filename for maria.Controller documentation
# ends up being 5a25124d2e.html.
#
# We cannot use tmp/maria-raw.js as the source file processed by JSDoc because an extra
# line is needed at the top of the file. This is the line that is used in
# build/dist/maria.js for the IIFE. At least an empty line is needed here so that line
# numbers in the documentation match the distribution built code.
#
# The file needs to be named "maria.js" so that the built documentation says "maria.js"
# rather than "maria-raw.js" or something else that is not the name of the real file
# that is distributed.
#
build/www/api: tmp/maria-raw.js lib/jsdoc
	mkdir -p build/www
	rm -f tmp/maria.js
	echo "" > tmp/maria.js
	cat tmp/maria-raw.js >> tmp/maria.js
	rm -rf build/www/api
	lib/jsdoc/jsdoc tmp/maria.js --destination build/www/api --configure etc/jsdoc-config.js

build/www/eg: build/dist/maria.js eg/* eg/*/* eg/*/*/* eg/*/*/* eg/*/*/*/* eg/*/*/*/*/*
	mkdir -p build/www
	rm -rf build/www/eg
	mkdir -p build/www/eg
	bin/build-example checkit
	bin/build-example scrollit
	bin/build-example timeit

lib/compiler:
	mkdir -p tmp/compiler
	cd tmp/compiler && \
	curl -O http://closure-compiler.googlecode.com/files/compiler-latest.zip && \
	unzip compiler-latest.zip
	mkdir -p lib/compiler
	mv tmp/compiler/compiler.jar lib/compiler

lib/jsdoc:
	mkdir -p tmp/jsdoc
	cd tmp/jsdoc && \
	curl curl -O https://nodeload.github.com/jsdoc3/jsdoc/tar.gz/v3.1.1 --output jsdoc-3.1.1.tar.gz && \
	tar xvzf jsdoc-3.1.1.tar.gz
	mkdir -p lib
	mv tmp/jsdoc/jsdoc-3.1.1 lib/jsdoc

clean:
	rm -rf build tmp

cleaner: clean
	rm -rf lib/compiler lib/jsdoc
