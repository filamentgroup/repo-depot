var streams = require('./streams');
var promise = require('rsvp');

var Streamed = require('./streamed').Streamed;
var Listed = require('./listed').Listed;

function Repos( user ){
  // expected by Streamed mixin
  this._config = { user: user };
  this._repos = undefined;
}

Repos.supported = {
  list: true
};

// Mixin for list handling
Listed.extend(Repos, 'full_name');

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Repos, streams.Repos);


module.exports.Repos = Repos;
