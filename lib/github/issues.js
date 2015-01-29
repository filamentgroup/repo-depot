var streams = require('./streams');
var promise = require('rsvp');

function Issues( user, repo ) {
  this._user = user;
  this._repo = repo;
};

Issues.prototype.open = function( callback ) {
  return new promise.Promise(this._open.bind(this));
};

// TODO reject on stream error
Issues.prototype._open = function(resolve, reject) {
  var sum = 0, issueStream = this._newStream();

  issueStream.on('data', function( issue ) {
    if( !issue.pull_request ){
      sum++;
    }
  });

  issueStream.on('end', function() {
    resolve( sum );
  });
};

Issues.prototype.oldest = function( callback ) {
  return new promise.Promise(this._oldest.bind(this));
};

// TODO reject on stream error
Issues.prototype._oldest = function(resolve, reject){
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
