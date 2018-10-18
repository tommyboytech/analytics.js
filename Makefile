
SRC = $(wildcard lib/*.js)

node_modules: package.json
	npm install
	touch $@

clean:
	rm -rf *.log analytics.js analytics.min.js

distclean: clean
	rm -rf node_modules

analytics.js: node_modules $(SRC) package.json
	./node_modules/.bin/browserify -e lib/index.js -o $@

analytics.min.js: analytics.js
	./node_modules/.bin/uglifyjs $< --output $@

build: analytics.min.js

lint: node_modules
	./node_modules/.bin/standard

.PHONY: clean distclean build lint
