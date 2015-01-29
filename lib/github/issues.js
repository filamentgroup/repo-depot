var streams = require('./streams');
var promise = require('rsvp');

function Issues( user, repo ) {
  this._user = user;
  this._repo = repo;
  this._issues = undefined;
};

Issues.supported = {
  open: true,
  oldest: true
};

// clear cached issues
Issues.prototype.reset = function() {
  this._issues = undefined;
};

Issues.prototype.open = function( callback ) {
  return new promise.Promise(this._open.bind(this));
};

// TODO reject on stream error
Issues.prototype._open = function(resolve, reject) {
  var sum = 0, issueStream = this._stream();

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
  var oldest, issueStream = this._stream();

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
    resolve(oldest);
  });
};

Issues.prototype._stream = function() {
  // if we have cached issues, the stream will simply reuse them
  var stream = new streams.Issues(this._user, this._repo, this._issues);

  // when the stream is done grab the cached issues
  stream.on('end', function() {
    this._issues = stream.cached();
  }.bind(this));

  // TODO sort this out
  stream.on('error', function( err ) {
    throw err;
  });

  return stream;
};


module.exports.Issues = Issues;
