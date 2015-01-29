var stream = require('stream');
var util = require('util');
var gh = require('./github/issues');
var promise = require('rsvp');

function Issues( data ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

Issues.supported = gh.Issues.supported;

util.inherits(Issues, stream.Transform);

Issues.prototype._transform = function(line, encode, done) {
  var user, repo, issues;

  line = line.toString();

  // TODO signal error whenever either is undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];

  var issues = new gh.Issues(user, repo);

  issues[this._data]().then(function(data) {
    this.push(data.toString());
    done();
  }.bind(this));
};

module.exports = {
  issues: Issues
};
