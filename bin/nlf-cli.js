#!/usr/bin/env node

/* eslint no-console: "off" */

/**
 *
 * @description cli for nlf
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly
 *
 * @license http://opensource.org/licenses/MIT The MIT License
 *
 */

'use strict';

const program = require('commander');
const pjson = require('../package.json');
const nlf = require('../lib/nlf');
const standardFormatter = require('../lib/formatters/standard');
const csvFormatter = require('../lib/formatters/csv');

const options = {
  directory: process.cwd(),
};

program
  .version(pjson.version)
  .option('-d, --no-dev', 'exclude development dependencies')
  .option('-s, --summary <mode>', 'summary (not available in csv format): off | simple (default) | detail', /^(off|simple|detail)$/i, 'simple')
  .option('-c, --csv', 'output in csv format')
  .option('-r, --reach [num]', 'package depth (reach)', parseInt, Infinity)
  .parse(process.argv);

options.production = !program.dev;
options.depth = program.reach;
options.summaryMode = program.summary;

// select which formatter
const format = program.csv ? csvFormatter : standardFormatter;

nlf.find(options)
.then((data) => {
  if (data && data.length > 0) {
    format.render(data, options, (renderErr, output) => {
      if (renderErr) {
        console.error(renderErr);
        process.exit(1);
      }
      console.log(output);
    });
  }
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});
