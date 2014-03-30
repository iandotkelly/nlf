<!-- @@NLF-IGNORE@@ -->

# Node License Finder (nlf) [![Build Status](https://secure.travis-ci.org/iandotkelly/nlf.png)](http://travis-ci.org/iandotkelly/nlf) [![Dependency Status](https://gemnasium.com/iandotkelly/nlf.png)](https://gemnasium.com/iandotkelly/nlf)

nlf is a utility for attempting to identify the licenses of modules in a node.js project.

It looks for license information in package.json, readme and license files in the project.  Please note, in many cases
the utility is looking
for standard strings in these files, such as MIT, BSD, Apache, GPL etc - this is not error free, so if you have any
concerns at all about the accuracy of the results, you will need to perform a detailed manual review of the project
and its dependencies, reading all terms of any included or referenced license.

## Use

nlf can be used programatically, or from the command line.

### CLI

To install:

```sh
$ npm install -g nlf

```

To use:

```sh
$ cd my-module
$ nlf
```

Example output:
<pre>
commander@0.6.1 [license(s): MIT]
└── readme files: MIT

read-installed@0.2.2 [license(s): BSD]
└── license files: BSD

glob@3.2.3 [license(s): BSD]
├── package.json:  BSD
└── license files: BSD

archy@0.0.2 [license(s): MIT/X11]
└── package.json:  MIT/X11

json-stringify-safe@5.0.0 [license(s): BSD]
├── package.json:  BSD
└── license files: BSD

should@1.2.2 [license(s): MIT]
└── readme files: MIT
</pre>

For output in CSV format use the -c (or --csv) switch:

```sh
$ cd my-module
$ nlf -c
```

To exclude development dependences and only analyze dependencies for production:

```sh
$ cd my-module
$ nlf -d
```

### Programatically

```javascript
var nlf = require('nlf');

nlf.find({ directory: '/User/me/my-project' }, function (err, data) {
	// do something with the response object.
	console.log(JSON.stringify(data));
});

// to only include production dependencies
nlf.find({
	directory: '/User/me/my-project',
	production: true
}, function (err, data) {
	// do something with the response object.
	console.log(JSON.stringify(data));
});

```

The data returned from find() is an array of modules, each of which is represented by an object as the following example:

```
{
  "id": "example@0.2.9",
  "name": "example",
  "version": "0.2.9",
  "repository": "http:\/\/github.com\/iandotkelly\/example",
  "directory": "\/Users\/ian\/example",
  "licenseSources": {
    "package": {
      "sources": [
        {
          "license": "MIT",
          "url": "http://opensource.org/MIT"
        }
      ]
    },
    "license": {
      "sources": [
        {
          "filePath": "\/Users\/ian\/Personal\/example\/LICENSE",
          "text": "the text of the license file",
          "name": function() { // function that returns the name of the license if known }
        }
      ]
    },
    "readme": {
      "sources": [
        {
          "filePath": "\/Users\/ian\/Personal\/example\/readme.md",
          "text": "text of the readme"
          "name": function() { // function that returns the name of the license if known }
        }
      ]
    }
  }
}
```

Each

### Tests

To run the npm unit tests, install development dependencies and run tests with 'npm test' or 'make'.

```sh
$ cd nlf
$ npm install
$ npm test
```
If you contribute to the project, tests are written in [mocha](http://visionmedia.github.com/mocha/), using [should.js](https://github.com/visionmedia/should.js/) or the node.js assert module.

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Ian Kelly

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

