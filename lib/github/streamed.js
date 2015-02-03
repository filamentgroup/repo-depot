var Promise = require('rsvp').Promise;

function stream() {
  // if we have cached issues, the stream will simply reuse them
  var stream = new this._streamType(this._config, this._cache);

  // when the stream is done grab the cached issues
  stream.on('end', function() {
    this._cache = stream.cached();
  }.bind(this));

  // TODO sort this out
  stream.on('error', function( err ) {
    throw err;
  });

  return stream;
}

// clear cached issues to force a refetch
function reset(){
  this._cache = undefined;
}

function promise(binding) {
  return new Promise(binding);
}

function extend( constr, streamType ) {
  constr.prototype._promise = promise;
  constr.prototype._reset = reset;
  constr.prototype._stream = stream;
  constr.prototype._streamType = streamType;
}

module.exports.Streamed = { extend: extend };
