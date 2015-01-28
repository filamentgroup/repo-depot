var streams = require('./streams');

function Issues( user, repo ) {
  this.user = user;
  this.repo = repo;
};

Issues.prototype.open = function( callback ) {
  var sum = 0, issueStream;

  issueStream = new streams.Issues(this.user, this.repo);

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


module.exports.Issues = Issues;
