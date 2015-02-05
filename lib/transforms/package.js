var stream = require('stream');
var util = require('util');
var gh = require('../github/issues');

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

  issues = new gh.Issues(user, repo);

  issues[this._data]().then(function(data) {
    this.push(data.toString() + "\n");
    done();
  }.bind(this)).catch(function( error ) {
    console.error(error.stack);
  });
};

module.exports = Issues;
