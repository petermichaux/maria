.PHONY: clean

LIBS = lib/evento.js                 \
       lib/hijos.js

SRCS = src/header.js                 \
       src/namespace.js              \
       src/borrowFromLibs.js         \
       src/Set.js                    \
       src/Model.js                  \
       src/SetModel.js               \
       src/View.js                   \
       src/Controller.js

maria.js: $(LIBS) $(SRCS)
	cat $(LIBS) $(SRCS) > maria.js

clean:
	rm maria.js
