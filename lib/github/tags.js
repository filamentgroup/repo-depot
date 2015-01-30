var streams = require('./streams');
var promise = require('rsvp');

var Streamed = require('./streamed').Streamed;

function Tags( user, repo ) {
  // expected by Streamed mixin
  this._config = {
    user: user,
    repo: repo
  };

  this._tags = undefined;
}

Tags.supported = {
  list: true
};

// clear cached issues
Tags.prototype.reset = function() {
  this._tags = undefined;
};

Tags.prototype.list = function( callback ) {
  return new promise.Promise(this._list.bind(this));
};

// TODO reject on stream error
Tags.prototype._list = function(resolve, reject){
  var tags = [], tagStream = this._stream();

  tagStream.on('data', function( tag ) {
    tags.push( tag.name );
  });

  tagStream.on('end', function() {
    resolve( tags );
  });
};

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Tags, streams.Tags);

module.exports.Tags = Tags;
