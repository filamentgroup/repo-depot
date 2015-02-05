var stream = require('stream');
var util = require('util');
var promise = require('rsvp');
var gh = require('../github/files');

function Files( data ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

Files.supported = gh.Files.supported;

util.inherits(Files, stream.Transform);

Files.prototype._transform = function(line, encode, done) {
  var user, repo, file, files;

  line = line.toString();

  // TODO signal error whenever either is undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];

  // this may be undefined
  file = line.split("/")[2];

  files = new gh.Files(user, repo, file);

  files[this._data]().then(function(data) {
    if( data.forEach ) {
      data.forEach(function( file ) {
        this.push(file.toString() + "\n");
      }.bind(this));
    }

    done();
  }.bind(this)).catch(function( error ) {
    console.error(error.stack);
  });
};

module.exports = Files;
