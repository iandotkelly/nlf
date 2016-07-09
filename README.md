<!-- @@NLF-IGNORE@@ -->

# Node License Finder (nlf)

[![Version](https://img.shields.io/npm/v/nlf.svg)](https://www.npmjs.com/package/nlf) [![Downloads](https://img.shields.io/npm/dm/nlf.svg)](https://www.npmjs.com/package/nlf)
[![Build Status](https://img.shields.io/travis/iandotkelly/nlf.svg)](https://travis-ci.org/iandotkelly/nlf) [![Dependency Status](https://gemnasium.com/iandotkelly/nlf.png)](https://gemnasium.com/iandotkelly/nlf)
[![Codacy Badge](https://www.codacy.com/project/badge/2c7e00c886b14a3a81e06a5eec19aa1f)](https://www.codacy.com/app/iandotkelly/nlf)
[![Coveralls](https://img.shields.io/coveralls/iandotkelly/nlf.svg)](https://coveralls.io/r/iandotkelly/nlf)

nlf is a utility for attempting to identify the licenses of modules in a node.js project.

It looks for license information in package.json, readme and license files in the project.  Please note, in many cases
the utility is looking
for standard strings in these files, such as MIT, BSD, Apache, GPL etc - this is not error free, so if you have any
concerns at all about the accuracy of the results, you will need to perform a detailed manual review of the project
and its dependencies, reading all terms of any included or referenced license.

## Use

nlf can be used programmatically, or from the command line.

## Options

- `directory` (String) - where to look
- `production` (Boolean) (Default:false) - only traverse dependencies, no dev-dependencies
- `depth` (Number) (Default: Infinity) - how deep to traverse packages where 0 is the current package.json only
- `summaryMode` (String: off|simple|detail) (Default: simple)


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
archy@0.0.2 [license(s): MIT/X11]
└── package.json:  MIT/X11

commander@0.6.1 [license(s): MIT]
└── readme files: MIT

glob@3.2.3 [license(s): BSD]
├── package.json:  BSD
└── license files: BSD

json-stringify-safe@5.0.0 [license(s): BSD]
├── package.json:  BSD
└── license files: BSD

read-installed@0.2.2 [license(s): BSD]
└── license files: BSD

should@1.2.2 [license(s): MIT]
└── readme files: MIT

LICENSES: BSD, MIT, MIT/X11
</pre>

For output in CSV format use the -c (or --csv) switch:

```sh
$ cd my-module
$ nlf -c
```

To exclude development dependencies and only analyze dependencies for production:

```sh
$ cd my-module
$ nlf -d
```

#### Summary Mode

`--summary <mode>` option, which can be set to "off", "simple" or "detail". This option controls what will be printed in summary in standard format.

* `off` turns off summary output
* `simple` shows a list of licenses used in the project, the default behavior
* `detail` shows all modules in current project and group by licenses. As example below:

```sh
LICENSES:
├─┬ BSD
│ ├── amdefine@1.0.0
│ ├── boom@0.4.2
│ ├── cryptiles@0.2.2
│ └── diff@1.4.0
├─┬ BSD-2-Clause
│ └── normalize-package-data@2.3.5
├─┬ Apache-2.0
│ ├── request@2.40.0
│ ├── spdx-correct@1.0.2
│ └── validate-npm-package-license@3.0.1
├─┬ (MIT AND CC-BY-3.0)
│ └── spdx-expression-parse@1.0.1
└─┬ MPL
  └── tough-cookie@2.2.1
```

### Programmatically

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

To run the unit tests, install development dependencies and run tests with 'gulp'.  Requires [gulp.js](http://gulpjs.com/) to be installed globally.

```sh
# only need to install gulp if you have not done so already
$ npm install -g gulp
$ cd nlf
$ npm install
$ gulp
```
If you contribute to the project, tests are written in [mocha](http://visionmedia.github.com/mocha/), using [should.js](https://github.com/visionmedia/should.js/) or the node.js assert module.
