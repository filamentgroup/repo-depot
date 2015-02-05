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
  show: true
};

Files.prototype.show = function( callback ) {
  return new promise.Promise(this._show.bind(this));
};

// TODO reject on stream error
Files.prototype._show = function(resolve, reject) {
  var sum = 0, fileStream = this._stream();

  fileStream.on('data', function( file ) {
    if( file.path == this._file ){
      console.log(file);
    }
  }.bind(this));

  fileStream.on('end', function() {
    resolve( sum );
  });
};


// Mixin for list handling
Listed.extend(Files, 'path');

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Files, streams.Files);

module.exports.Files = Files;
