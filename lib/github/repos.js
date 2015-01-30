var streams = require('./streams');
var promise = require('rsvp');

var Streamed = require('./streamed').Streamed;

function Repos( user ){
  // expected by Streamed mixin
  this._config = { user: user };
  this._repos = undefined;
}

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

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Repos, streams.Repos);


module.exports.Repos = Repos;
