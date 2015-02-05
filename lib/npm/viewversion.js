var streams = require('./streams');
var promise = require('rsvp');

function ViewVersion( repo ) {
  // expected by Streamed mixin
  this._config = {
    repo: repo
  };
}

ViewVersion.supported = {
  list: true
};

ViewVersion.prototype._stream = function() {
  // if we have cached issues, the stream will simply reuse them
  var stream = new streams.ViewVersion( this._config );

  // TODO sort this out
  stream.on('error', function( err ) {
    throw err;
  });

  return stream;
};

ViewVersion.prototype.list = function( callback ) {
  return new promise.Promise(this._list.bind(this));
};

// TODO reject on stream error
ViewVersion.prototype._list = function(resolve, reject){
  var results = [], tagStream = this._stream();

  tagStream.on('data', function( result ) {
    results.push( result );
  });

  tagStream.on('end', function() {
    resolve( results );
  });
};

module.exports.ViewVersion = ViewVersion;
