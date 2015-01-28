var stream = require('stream');
var util = require('util');
var gh = require('./github/issues');

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

  // TODO signal error from GH api
  issues.outstanding(function( count ) {
    this.push(count.toString());
    callback();
  }.bind(this));
};

module.exports = {
  Issues: Issues
};
