var streams = require('./streams');
var promise = require('rsvp');
var semver = require('semver');

var Streamed = require('./streamed').Streamed;
var Listed = require('./listed').Listed;

function Filenames( user, repo, sha ) {
  // expected by Streamed mixin
  this._config = {
    user: user,
    repo: repo,
    sha: sha || 'master'
  };
}

Filenames.supported = {
  list: true
};

// Mixin for list handling
Listed.extend(Filenames, 'path');

// mixin for stream instantiation, includes cache/error handling
Streamed.extend(Filenames, streams.Filenames);

module.exports.Filenames = Filenames;
