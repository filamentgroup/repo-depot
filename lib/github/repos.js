var streams = require('./streams');
var promise = require('rsvp');

function Repos( user ){
  this._user = user;
  this._repos = undefined;
};

Repos.supported = {
  list: true
};

Repos.prototype.list = function() {
  return new promise.Promise(this._list.bind(this));
};

Repos.prototype._list = function(resolve, reject) {
  var list = [], stream = this._stream();

  stream.on('data', function( repo ) {
    list.push(repo.full_name);
  });

  stream.on('end', function() {
    resolve( list );
  });
};

Repos.prototype._stream = function() {
  // if we have cached issues, the stream will simply reuse them
  var stream = new streams.Repos(this._user, this._repos);

  // when the stream is done grab the cached issues
  stream.on('end', function() {
    this._repos = stream.cached();
  }.bind(this));

  // TODO sort this out
  stream.on('error', function( err ) {
    throw err;
  });

  return stream;
};


module.exports.Repos = Repos;
