# nlf

nlf is a utility for attempting to identify the licenses of modules in a node.js project.

It looks for license information in package.json, readme and license files in the project.  Please note, in many cases
the utility is looking
for standard strings in these files, such as MIT, BSD, Apache, GPL etc - this is not error free, so if you have any 
concerns at all about the accuracy of the results, you will need to perform a detailed manual review of the project
and its dependencies, reading all terms of any included or referenced license.

## Setup

PLEASE NOTE THIS HAD NOT BEEN PUBLISHED TO NPM YET.

Do this:

```sh
$ npm install -g nlf

```

### Using

nlf can be used programatically, or from the command line

## Programatically

## CLI

```sh
$ nlf -h

  Usage: nlf [options]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -p, --production  production dependencies only, ignore any devDependencies in package.json
    -c, --csv         report in csv format

```

## Revision History

### 0.0.1

- Does stuff - but not much

### License

The MIT License (MIT)

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

[node.js]: http://nodejs.org
[mocha]: http://visionmedia.github.com/mocha/
[The MIT License (MIT)]: http://opensource.org/licenses/MIT

