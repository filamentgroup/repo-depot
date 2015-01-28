var transforms = require('./transforms');
var split = require('split');

// TODO:
// 1. command line flags for different transforms
// 2. Issues
// 3. PRs
// 4. Checklist

module.exports.run = function() {
  process.stdin
    .pipe(split())
    .pipe(new transforms.Issues())
    .pipe(process.stdout);
};
