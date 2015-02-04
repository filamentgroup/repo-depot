var stream = require('stream');
var util = require('util');

function Json( data ) {
  this._data = data;
  this._first = true;
  stream.Transform.call(this, { objectMode: true });
}

util.inherits(Json, stream.Transform);

Json.supported = {
  to: true
};

Json.prototype.to = function(line) {
  if( this._first ){
    this.push( "[" );
  }

  if( !this._first ){
    this.push( "," );
  }

  // TODO this is my solution to escaping, not confident
  this.push(JSON.stringify(line.toString()));

  this._first = false;
};

Json.prototype._flush = function( done ) {
  this.push( "]" );
  done();
};

Json.prototype._transform = function(line, encode, done) {
  this[this._data](line);
  done();
};

module.exports = Json;
