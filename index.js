module.exports = process.env.NLF_COV
	? require('./lib-cov/nlf')
	: require('./lib/nlf');
