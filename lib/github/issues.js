var streams = require('./streams');

function Issues( user, repo ) {
  this._user = user;
  this._repo = repo;
};

Issues.prototype.open = function( callback ) {
  var sum = 0, issueStream = this._newStream();

  issueStream.on('end', function() {
    callback( sum );
  });

  issueStream.on('data', function( issue ) {
    if( !issue.pull_request ){
      sum++;
    }
  });
};

Issues.prototype.oldest = function( callback ) {
  var oldest, issueStream = this._newStream();

  issueStream.on('data', function( issue ) {
    var current;

    if( !oldest ){
      oldest = new Date(issue.created_at);
      return;
    }

    current = new Date(issue.created_at);

    oldest = current < oldest ? current : oldest;
  });

  issueStream.on('end', function() {
    callback(oldest);
  });
};

Issues.prototype._newStream = function() {
  var stream = new streams.Issues(this._user, this._repo);

  stream.on('error', function( err ) {
    throw err;
  });

  return stream;
};


module.exports.Issues = Issues;
