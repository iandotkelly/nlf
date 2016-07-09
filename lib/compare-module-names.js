/**
 * @description Compare two modules for name and semver
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2016
 *
 * @license  The MIT License
 */

'use strict';

var compareVersions = require('compare-versions');

/**
 * Compare name and semver of two modules, returning -1
 * if the name of the first is alphabetically lower or
 * name is the same and its an older semver
 *
 * @param  {Object} module1
 * @param  {Object} module2
 * @return {Number}         -1 for lower, 0 for same, +1 for higher
 */
module.exports = function(module1, module2) {
	if (module1.name < module2.name) {
		return -1;
	}
	if (module1.name > module2.name) {
		return 1;
	}
	return compareVersions(module1.version, module2.version);
};
