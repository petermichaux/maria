.PHONY: clean

LIBS_MIN = lib/evento/evento-min.js  \
           lib/hijos/hijos-min.js    \
           lib/abeja/abeja-min.js    \
           lib/abeja/pajar-min.js

LIBS = lib/evento/evento.js          \
       lib/hijos/hijos.js            \
       lib/abeja/abeja.js            \
       lib/abeja/pajar.js

SRCS = src/header.js                 \
       src/namespace.js              \
       src/borrowFromLibs.js         \
       src/Set.js                    \
       src/Model.js                  \
       src/SetModel.js               \
       src/View.js                   \
       src/ContainerView.js          \
       src/SetListView.js            \
       src/Controller.js

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
