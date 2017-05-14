/**
 * @description A file source for a potential license
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2013-2017
 *
 * @license  The MIT License
 */

'use strict';

const licenseFind = require('./license-find');
const fs = require('fs');

/**
 * Constructor
 *
 * @param {String} filePath Path of the file
 * @returns {Object} The FileSource object
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
FileSource.prototype.read = function read() {
  return new Promise((resolve, reject) => {
    fs.readFile(this.filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }

      this.text = data;
      return resolve();
    });
  });
};

/**
 * Returns which licenses this file potentially declares
 *
 * @return {Array} Array of license name strings
 */
FileSource.prototype.names = function names() {
  return licenseFind(this.text);
};

module.exports = FileSource;
