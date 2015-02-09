var stream = require('stream');
var util = require('util');
var npmversion = require('../npm/viewversion');

function NpmVersion( data, extra ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

NpmVersion.supported = npmversion.ViewVersion.supported;

util.inherits(NpmVersion, stream.Transform);

NpmVersion.prototype._transform = function(line, encode, done) {
  var viewVersion = new npmversion.ViewVersion( line.toString() );

  viewVersion[this._data]().then(function(data) {
    this.push(data.join("\n"));
  }.bind(this)).catch(function( error ) {
    console.error(error.stack);
  });
};

module.exports = NpmVersion;
