var stream = require('stream');
var util = require('util');
var promise = require('rsvp');
var gh = require('../github/filenames');

function Filenames( data ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

Filenames.supported = gh.Filenames.supported;

util.inherits(Filenames, stream.Transform);

Filenames.prototype._transform = function(line, encode, done) {
  var user, repo, tags;

  line = line.toString();

  // TODO signal error whenever either is undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];

  tags = new gh.Filenames(user, repo);

  tags[this._data]().then(function(data) {
    data.forEach(function( file ) {
      this.push(file.toString() + "\n");
    }.bind(this));

    done();
  }.bind(this)).catch(function( error ) {
    console.error(error.stack);
  });
};

module.exports = Filenames;
