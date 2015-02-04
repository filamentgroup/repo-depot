var stream = require('stream');
var util = require('util');
var npmsearch = require('../npm/search');

function Search( data, extra ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

Search.supported = npmsearch.Search.supported;

util.inherits(Search, stream.Transform);

Search.prototype._transform = function(line, encode, done) {
  var repo, version, split, tagsearch;

  split = line.toString().split( "@" );
  repo = split[ 0 ];
  version = split[ 1 ];

  tagsearch = new npmsearch.Search( repo, version );

  tagsearch[this._data]().then(function(data) {
    this.push(data.join("\n"));
  }.bind(this)).catch(function( error ) {
    console.error(error.stack);
  });
};

module.exports = Search;
