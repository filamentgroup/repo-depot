var streams = require('./streams');
var promise = require('q');

function Issues( user, repo ) {
  this._user = user;
  this._repo = repo;
};

Issues.prototype.open = function( callback ) {
  return promise.Promise(this._open);
};

// TODO reject on stream error
// TODO maybe notify on each date
Issues.prototype._open = function(resolve, reject, notify) {
  var sum = 0, issueStream = this._newStream();

  issueStream.on('end', function() {
    resolve( sum );
  });

  issueStream.on('data', function( issue ) {
    if( !issue.pull_request ){
      sum++;
    }
  });
};

Issues.prototype.oldest = function( callback ) {
  return promise.Promise(this._oldest);
};

// TODO reject on stream error
// TODO maybe notify on each date
Issues.prototype._oldest = function(resolve, reject, notify){
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
    resolve(oldest.toTimeString());
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
