all: test

test:
	node test/mocha-runner.js

.PHONY: all test
