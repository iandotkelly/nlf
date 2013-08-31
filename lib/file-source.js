/**
 * @description A file source for a potential license
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2013
 *
 * @license  The MIT License
 */

'use strict';

var licenseFind = require('./license-find'),
	fs = require('fs');

/**
 * Constructor
 * 
 * @param {String} filePath Path of the file
 * @returns {Object}		The FileSource object
 */
function FileSource(filePath) {

	if (typeof filePath !== 'string') {
		throw new Error('filePath must be a string');
	}

	this.filePath = filePath;
	this.text = '';

	return this;
}

/**
 * Read the file
 * 
 * @param  {Function} callback Callback (err)
 */
FileSource.prototype.read = function (callback) {

	var self = this;

	fs.readFile(this.filePath, 'utf-8', function (err, data) {
		if (err) {
			return callback(err);
		}

		self.text = data;
		callback(null);
	});
};

/**
 * Returns which licenses this file potentially declares
 * 
 * @return {Array} Array of license name strings
 */
FileSource.prototype.names = function () {

	return licenseFind(this.text);

};


module.exports = FileSource;