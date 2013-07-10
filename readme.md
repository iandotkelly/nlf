# nlf

nlf is a utility for attempting to identify the licenses of modules in a node.js project.

It looks for license information in package.json, readme and license files in the project.  Please note, in many cases
the utility is looking
for standard strings in these files, such as MIT, BSD, Apache, GPL etc - this is not error free, so if you have any 
concerns at all about the accuracy of the results, you will need to perform a detailed manual review of the project
and its dependencies, reading all terms of any included or referenced license.

## Setup

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

The [MIT] License

[node.js]: http://nodejs.org
[mocha]: http://visionmedia.github.com/mocha/
[MIT]: http://opensource.org/licenses/MIT

