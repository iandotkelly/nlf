all: test

test:
	node test/mocha-runner.js

test-cov: lib-cov
	NLF_COV=1 \
		MOCHA_REPORTER=html-cov \
		node test/mocha-runner > coverage.html

lib-cov:
	jscoverage lib lib-cov

.PHONY: all test test-cov
