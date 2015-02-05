var client = require('./client');
var streams = require('./streams');
var promise = require('rsvp');

function Blob( user, repo, sha ) {
  // expected by Streamed mixin
  this._config = {
    user: user,
    repo: repo,
    sha: sha
  };
}

Blob.supported = {
  out: true
};

Blob.prototype.out = function( callback ) {
  return new promise.Promise(this._out.bind(this));
};

Blob.prototype._out = function(resolve, reject) {
  client.gitdata.getBlob(this._config, function(err, data) {
    if(err){
      reject(err);
    }

    resolve(data);
  });
};

module.exports.Blob = Blob;
