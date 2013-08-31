all: lint test

test:
	node test/mocha-runner.js

test-cov: lib-cov
	NLF_COV=1 \
		MOCHA_REPORTER=html-cov \
		node test/mocha-runner > coverage.html

lib-cov:
	jscoverage lib lib-cov

lint:
	./node_modules/.bin/jshint \
		--verbose \
		index.js \
		test/unit/formatters/*.js \
		test/unit/*.js \
		lib/*.js \
		lib/formatters/*.js 

.PHONY: all test test-cov
