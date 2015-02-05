var streams = require('./streams');
var promise = require('rsvp');
var semver = require('semver');

var Streamed = require('./streamed').Streamed;
var Listed = require('./listed').Listed;

function Files( user, repo, file ) {
  // expected by Streamed mixin
  this._config = {
    user: user,
    repo: repo,
    // TODO
    sha: 'master'
  };

  this._file = file;
}

Files.supported = {
  list: true,
  json: true
};

Files.prototype.json = function( callback ) {
  return new promise.Promise(this._json.bind(this));
};

// TODO reject on stream error
Files.prototype._json = function(resolve, reject) {
  var json, fileStream = this._stream();

  fileStream.on('data', function( file ) {
    if( file.path == this._file ){
      json = JSON.stringify(file);
    }
  }.bind(this));

  fileStream.on('end', function() {
    resolve( json );
  });
};


// Mixin for list handling
Listed.extend(Files, 'path');

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Files, streams.Files);

module.exports.Files = Files;
