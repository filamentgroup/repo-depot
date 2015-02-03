var streams = require('./streams');
var promise = require('rsvp');
var semver = require('semver');

var Streamed = require('./streamed').Streamed;
var Listed = require('./listed').Listed;

function Tags( user, repo ) {
  // expected by Streamed mixin
  this._config = {
    user: user,
    repo: repo
  };
}

Tags.supported = {
  list: true,
  newest: true
};

Tags.prototype.newest = function( callback ) {
  return new promise.Promise(this._newest.bind(this));
};

// TODO reject on stream error
Tags.prototype._newest = function(resolve, reject){
  var newest, tagStream = this._stream();

  tagStream.on('data', function( tag ) {
    if( !newest ){
      newest = tag.name;
      return;
    }

    if( semver.gt( tag.name, newest ) ) {
      newest = tag.name;
    }
  });

  tagStream.on('end', function() {
    resolve( newest );
  });
};

// Mixin for list handling
Listed.extend(Tags, 'name');

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Tags, streams.Tags);

module.exports.Tags = Tags;
