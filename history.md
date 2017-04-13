1.4.3 (February 1, 2017)
====================

* Update dependencies and add travis tests for node 7 and remove testing on node 0.10 and 0.12

1.4.2 (August 2, 2016)
====================

* Update dependencies to remove vulnerability in glob-all #40

1.4.1 (July 9, 2016)
====================

* Removes git+ prefix from git+https repository
* Fix issue where license key (e.g. MIT) is at the very end of the file
* Adds Public Domain license
* Moved MIT license text into a separate LICENSE.md file
* Sorts list of modules by name@version, not just name

1.4.0 (January 16, 2016)
====================

* Add support for reporting modules grouped by license

1.3.3 (July 14, 2015)
====================

* Ignore files that happen to be in node_module or bower_component folders

1.3.2 (July 12, 2015)
====================

* Support object being used for license or licenses property of package.json
* Bump development dependencies

1.3.1 (May 10, 2015)
====================

* Fix issue where a root module without a name or version will result in an exception being thrown
* Bump dependencies

1.3.0 (Apr 12, 2015)
====================

* Fix issue where npm modules incorrectly using a string in licenses property was interpreted as an array
* Add a LICENSES summary to the standard formatter

1.2.1 (Apr 12, 2015)
====================

* Move project from 'make' to 'gulp' for easier support on Windows
* Bump dependencies

1.2.0 (Mar 29, 2015)
====================

* Optimize globbing of files to siginificantly improve performance
* Sort output data alphabetically
* Bump dependencies

1.1.0
=================

* Adds maximum depth feature
* Bump dependencies (archy@1.0.0)

1.0.2
=================

* Update read-installed dependency, which now supports semver@3
* Bump other dependencies

1.0.1
=================

* Remove shrinkwrap entirely, as it was making unnecessarily go out of date
* Bump dependencies

1.0.0
=================

Potentially breaking change, only node 0.10 and above supported.

* Updated glob to version 4.0.0
* Shrinkwrap file now no-longer tailored to work on node 0.8


0.2.11
=================

This will be the last version supporting node.js 0.8.x. Changes to dependencies are making
support of 0.8 difficult, requiring manual editing of shrinkwrap files.

 * Bump dependencies, including read-installed to 2.0.4 & glob to 3.2.11

0.2.10
=================

 * Bump dependencies, particularly commander to 0.2.2

0.2.9
=================

 * Fix
   - Issue where modules with directories with license or readme threw exceptions
 * Bump deps
