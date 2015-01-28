var client = require('../client');
var stream = require('stream');
var util = require('util');

function Issues(user, repo) {
  this.page = undefined;
  this.user = user;
  this.repo = repo;
  stream.Readable.call(this, { objectMode: true });
}

util.inherits(Issues, stream.Readable);

Issues.prototype._read = function() {
  // completely new request
  if( !this.page ){
    this._clientCall(this._newPage.bind(this));
    return;
  }

  // we have results, just haven't pushed all of them
  if( this.page.length ){
    this.push(this.page.pop());
    return;
  }

  // last page is empty, need a new page or we're done
  if( client.hasNextPage(this.page) ){
    client.getNextPage(this.page, this._newPage.bind(this));
  } else {
    this.page = undefined;
    this.push(null);
  }
};

Issues.prototype._newPage = function(err, data) {
  if( err ){
    this.emit( 'error', new Error(err.message) );
    return;
  }

  this.page = data;
  this.push(this.page.pop());
};

Issues.prototype._clientCall = function( callback ) {
  var options = {
    user: this.user,
    repo: this.repo,
    state: 'open'
  };

  client.issues.repoIssues(options, callback);
};

module.exports.Issues = Issues;
