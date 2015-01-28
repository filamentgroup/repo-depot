var client = require('./client');

function Issues( user, repo ) {
  this.user = user;
  this.repo = repo;
};

Issues.prototype.outstanding = function( callback ) {
  var sum = this._sum(callback);

  client.issues.repoIssues({
    user: this.user,
    repo: this.repo,
    // TODO option
    state: 'open'
  }, sum);
};

Issues.prototype._sum = function( callback ) {
  var sum = 0, recur;

  recur = function( err, data ) {
    // filter pull requests
    sum += data.filter(function( issue ) {
      return !issue.pull_request;
    }).length;

    // TODO handle err
    // if theres a page sum up the results
    if( client.hasNextPage(data) ){
      client.getNextPage(data, recur);
      return;
    }

    // if theres not another page return the sum
    callback(sum);
  };

  return recur;
};

Issues.prototype.oldest = function() {
  return 4;
};

module.exports.Issues = Issues;
