var stream = require('stream');
var util = require('util');
var gh = require('./github/issues');
var promise = require('q');

function Issues() {
  stream.Transform.call(this, { objectMode: true });
}

util.inherits(Issues, stream.Transform);

Issues.prototype._transform = function(line, encode, callback) {
  var user, repo, issues;

  line = line.toString();

  // TODO signal error whenever either is undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];

  var issues = new gh.Issues(user, repo);

  promise.allSettled([ issues.count(), issues.oldest() ])
    .then(function( results ) {
      results.forEach(function( out ) {
        this.push(out);
      }.bind(this));
    }.bind(this));
};

module.exports = {
  Issues: Issues
};
