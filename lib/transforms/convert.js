var stream = require('stream');
var util = require('util');
var fs = require('fs');
var Mustache = require('mustache');

function Convert( data, extra ) {
  this._data = data;
  this._templatePath = extra[0];
  this._template = undefined;
  this._first = true;
  stream.Transform.call(this, { objectMode: true });
}

util.inherits(Convert, stream.Transform);

Convert.supported = {
  array: true,
  template: 1
};

Convert.prototype.array = function(line, done) {
  if( this._first ){
    this.push( "[" );
  }

  // ignore empty lines
  // TODO might be good to leave line stripping to the next tool?
  if( line.toString() ) {
    if( !this._first ){
      this.push( "," );
    }

    this.push(JSON.stringify(line.toString()));
  }

  this._first = false;
  done();
};

Convert.prototype._render = function(line) {
  return Mustache.render(this._template, {line: line});
};

Convert.prototype.template = function(line, done) {
  // don't template empty lines
  if( line.toString() ) {
    // if we have the template render and push
    if( this._template ){
      this.push(this._render(line));
      done();
    } else {
      // if the template hasn't been cached, get it
      fs.readFile(this._templatePath, function(err, data) {
        if( err ){
          this.emit( 'error', err );
        }

        // cache the template for later
        this._template = data.toString();
        this.push(this._render(line));
        done();
      }.bind(this));
    }
  }
};

Convert.prototype._flush = function( done ) {
  if( this._data == "array" ) {
    this.push( "]");
  }

  done();
};

Convert.prototype._transform = function(line, encode, done) {
  this[this._data](line, done);
};

module.exports = Convert;
