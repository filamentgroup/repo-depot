var client = require('../client');
var stream = require('stream');
var util = require('util');

// existing is used when consumers want to use cached values
// but still want to consume the issues using the stream interface
function Repos(user, existing){
  this._page = existing;
  this._user = user;
  this._cache = [];
  stream.Readable.call(this, { objectMode: true });
}

util.inherits(Repos, stream.Readable);

Repos.prototype.cached = function() {
  return this._cache;
};

Repos.prototype._cachedPush = function() {
  var toPush = this._page.pop();
  this._cache.push(toPush);
  this.push(toPush);
};

Repos.prototype._read = function() {
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

Repos.prototype._newPage = function(err, data) {
  if( err ){
    this.emit( 'error', new Error(err.message) );
    return;
  }

  this._page = data;
  this._cachedPush();
};

Repos.prototype._initialPage = function() {
  var options = {
    user: this._user
  };

  client.repos.getFromUser(options, this._newPage.bind(this));
};

Repos.prototype._nextPage = function() {
  // last page is empty, need a new page or we're done
  if( !this._cache && client.hasNextPage(this._page) ){
    client.getNextPage(this._page, this._newPage.bind(this));
  } else {
    this._page = undefined;
    this.push(null);
  }
};

module.exports.Repos = Repos;
