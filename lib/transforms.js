var stream = require('stream');
var util = require('util');
var gh = require('./github/issues');
var promise = require('rsvp');

function Issues() {
  stream.Transform.call(this, { objectMode: true });
}

util.inherits(Issues, stream.Transform);

Issues.prototype._transform = function(line, encode, done) {
  var user, repo, issues;

  line = line.toString();

  // TODO signal error whenever either is undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];

  var issues = new gh.Issues(user, repo);

  issues.open().then(function(count) {
    this.push(count.toString());

    // proceed with the next issue output
    return issues.oldest();
  }.bind(this)).then(function( oldestDate ) {
    this.push(oldestDate.toTimeString());
  }.bind(this));

};

module.exports = {
  Issues: Issues
};
