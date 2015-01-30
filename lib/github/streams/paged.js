var client = require('../client');
var stream = require('stream');
var util = require('util');

// existing is used when consumers want to use cached values
// but still want to consume the issues using the stream interface
function Paged(config){
  this._page = config.existing;
  this._config = config;
  this._cache = [];
  stream.Readable.call(this, { objectMode: true });
}

util.inherits(Paged, stream.Readable);

Paged.prototype.cached = function() {
  return this._cache;
};

Paged.prototype._cachedPush = function() {
  var toPush = this._page.pop();
  this._cache.push(toPush);
  this.push(toPush);
};

Paged.prototype._read = function() {
  // completely new request
  if( !this._page ){
    this._initialPage();
    return;
  }

  // we have results, just haven't pushed all of them
  if( this._page.length ){
    this._cachedPush();
    return;
  }

  this._nextPage();
};

Paged.prototype._newPage = function(err, data) {
  if( err ){
    this.emit( 'error', new Error(err.message) );
    return;
  }

  this._page = data;
  this._cachedPush();
};

Paged.prototype._initialPage = function() {
  var options = this._config.reqOptions;

  this._config.clientRequest(options, this._newPage.bind(this));
};

Paged.prototype._nextPage = function() {
  // last page is empty, need a new page or we're done
  if( !this._cache && client.hasNextPage(this._page) ){
    client.getNextPage(this._page, this._newPage.bind(this));
  } else {
    this._page = undefined;
    this.push(null);
  }
};

module.exports.Paged = Paged;
