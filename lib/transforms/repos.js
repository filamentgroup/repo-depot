var stream = require('stream');
var util = require('util');
var promise = require('rsvp');
var gh = require('../github/repos');

function Repos( data ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

Repos.supported = gh.Repos.supported;

util.inherits(Repos, stream.Transform);

Repos.prototype._transform = function(line, encode, done) {
  var user, repos;

  user = line.toString();

  var repos = new gh.Repos(user);

  repos[this._data]().then(function(data) {
    this.push(data.join("\n"));
  }.bind(this));
};

module.exports = Repos;
