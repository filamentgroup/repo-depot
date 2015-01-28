var client = require('./client');
var stream = require('stream');
var util = require('util');

function Issues( user, repo ) {
  this.user = user;
  this.repo = repo;
  this.stream
};

Issues.prototype.open = function( callback ) {
  var sum = 0, issueStream;

  issueStream = new IssueStream(this.user, this.repo);

  issueStream.on('data', function( issue ) {
    if( !issue.pull_request ){
      sum++;
    }
  });

  issueStream.on('end', function() {
    callback(sum);
  });

  issueStream.on('error', function( err ) {
    throw err;
  });
};

function IssueStream(user, repo) {
  this.page = undefined;
  this.user = user;
  this.repo = repo;
  stream.Readable.call(this, { objectMode: true });
}

util.inherits(IssueStream, stream.Readable);

IssueStream.prototype._read = function() {
  // completely new request
  if( !this.page ){
    client.issues.repoIssues({
      user: this.user,
      repo: this.repo,
      state: 'open'
    }, this._newPage.bind(this));

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
    this.push(null);
  }
};

IssueStream.prototype._newPage = function(err, data) {
  if( err ){
    this.emit( 'error', new Error(err.message) );
  }

  this.page = data;
  this.push(this.page.pop());
};

module.exports.Issues = Issues;
