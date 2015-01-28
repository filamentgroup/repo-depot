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
};

function IssueStream(user, repo) {
  this.lastPage = undefined;
  this.user = user;
  this.repo = repo;
  stream.Readable.call(this, { objectMode: true });
}

util.inherits(IssueStream, stream.Readable);

IssueStream.prototype._read = function() {
  // completely new request
  if( !this.lastPage ){
    client.issues.repoIssues({
      user: this.user,
      repo: this.repo,
      state: 'open'
    }, this._nextPage.bind(this));

    return;
  }

  // we have results, just haven't pushed all of them
  if( this.lastPage.length ){
    this.push(this.lastPage.pop());
    return;
  }

  // last page is empty, need a new page or we're done
  if( client.hasNextPage(this.lastPage) ){
    client.getNextPage(this.lastPage, this._nextPage.bind(this));
  } else {
    this.push(null);
  }
};

IssueStream.prototype._nextPage = function(err, data) {
  this.lastPage = data;
  this.push(this.lastPage.pop());
};

module.exports.Issues = Issues;
