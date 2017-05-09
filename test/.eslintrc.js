module.exports = {
  extends: '../.eslintrc.js',
  rules: {
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
    'no-unused-expressions': ['off'],
  },
  env: {
    node: true,
    mocha: true,
  }
}
