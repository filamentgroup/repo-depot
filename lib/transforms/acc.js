var stream = require('stream');
var util = require('util');
var fs = require('fs');
var Mustache = require('mustache');

function Acc( data, extra ) {
  this._data = data;
  this._templatePath = extra[0];
  this._template = undefined;
  this._all = [];
  stream.Transform.call(this, { objectMode: true });
}

util.inherits(Acc, stream.Transform);

Acc.supported = {
  // requires one extra argument (the path)
  template: 1
};

Acc.prototype._render = function(all) {
  return Mustache.render(this._template, {all: all});
};


// TODO lots of duplication with Convert
Acc.prototype._flush = function( done ) {
  var all = this._all.join("\n");

  // don't template empty arrays
  if( all ) {
    // if we have the template render and push
    if( this._template ){
      this.push(this._render(all));
      done();
    } else {
      // if the template hasn't been cached, get it
      fs.readFile(this._templatePath, function(err, data) {
        if( err ){
          this.emit( 'error', err );
        }

        // cache the template for later
        this._template = data.toString();
        this.push(this._render(all));
        done();
      }.bind(this));
    }
  }
};

Acc.prototype._transform = function(line, encode, done) {
  if( line.toString() ){
    this._all.push(line.toString());
  }

  done();
};

module.exports = Acc;
