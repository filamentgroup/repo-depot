var stream = require('stream');
var util = require('util');
var gh = require('../github/tags');

function Tags( data ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

Tags.supported = gh.Tags.supported;

util.inherits(Tags, stream.Transform);

Tags.prototype._transform = function(line, encode, done) {
  var user, repo, tags;

  line = line.toString();

  // TODO signal error whenever either is undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];

  tags = new gh.Tags(user, repo);

  tags[this._data]().then(function(data) {
    if( !data ){
      done();
      return;
    }

    // If no tags exist, data will be undefined
    if( data.forEach ) {
      data.forEach(function(tag) {
        this.push(tag.toString() + "\n");
      }.bind(this));
    } else {
      this.push(data.toString() + "\n");
    }

    done();
  }.bind(this)).catch(function( error ) {
    console.error(error.stack);
  });
};

module.exports = Tags;
