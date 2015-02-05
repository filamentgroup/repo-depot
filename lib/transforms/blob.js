var stream = require('stream');
var util = require('util');
var gh = require('../github/blob');

function Blob( data ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

Blob.supported = gh.Blob.supported;

util.inherits(Blob, stream.Transform);

Blob.prototype._transform = function(line, encode, done) {
  var user, repo, sha, blob;

  line = line.toString();

  // TODO error any undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];
  sha = line.split("/")[2];

  blob = new gh.Blob(user, repo, sha);

  blob[this._data]().then(function(data) {
    // decode the base 64 data
    this.push((new Buffer(data.content, 'base64')).toString());
    done();
  }.bind(this)).catch(function( error ) {
    console.error(error.stack);
  });
};

module.exports = Blob;
