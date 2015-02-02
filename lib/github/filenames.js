var streams = require('./streams');
var promise = require('rsvp');
var semver = require('semver');

var Streamed = require('./streamed').Streamed;

function Filenames( user, repo, sha ) {
  // expected by Streamed mixin
  this._config = {
    user: user,
    repo: repo,
    sha: sha || 'master'
  };
}

Filenames.supported = {
  list: true
};

Filenames.prototype.list = function( callback ) {
  return new promise.Promise(this._list.bind(this));
};

// TODO reject on stream error
Filenames.prototype._list = function(resolve, reject){
  var files = [], tagStream = this._stream();

  tagStream.on('data', function( tag ) {
    files.push( tag.path );
  });

  tagStream.on('end', function() {
    resolve( files );
  });
};

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Filenames, streams.Filenames);

module.exports.Filenames = Filenames;
