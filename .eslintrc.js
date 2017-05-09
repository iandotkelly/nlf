
module.exports = {
  // we're going to use airbnb as a basis
  extends: 'airbnb-base',
  parserOptions: {
    // this is all node.js code - no modules
    "sourceType": "script"
  },
  rules: {
    // this is all node.js code - all need 'use strict';
    'strict': ['error', 'global'],
    // personally I think for-of is fine in many situations
    'no-restricted-syntax': ['off', { selector: 'ForOfStatement' }],
    // we're not building objects in a strange way
    'no-prototype-builtins': 'off',
  },
  env: {
    node: true,
  }
}
