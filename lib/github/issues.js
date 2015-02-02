var streams = require('./streams');
var promise = require('rsvp');

var Streamed = require('./streamed').Streamed;

function Issues( user, repo ) {
  // expected by Streamed mixin
  this._config = {
    user: user,
    repo: repo
  };
}

Issues.supported = {
  open: true,
  oldest: true
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

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Issues, streams.Issues);

module.exports.Issues = Issues;
