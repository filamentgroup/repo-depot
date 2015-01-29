var stream = require('stream');
var util = require('util');
var gh = require('./github/issues');
var promise = require('rsvp');

function Issues() {
  stream.Transform.call(this, { objectMode: true });
}

util.inherits(Issues, stream.Transform);

Issues.prototype._transform = function(line, encode, done) {
  var user, repo, issues;

  line = line.toString();

  // TODO signal error whenever either is undefined
  user = line.split("/")[0];
  repo = line.split("/")[1];

  var issues = new gh.Issues(user, repo);



  promise.all([ issues.open(), issues.oldest() ])
    .then(function( results ) {

      // for both results push them to the pipe
      results.forEach(function( out ) {
        this.push(out.toString());
      }.bind(this));

      // once that's done close out this transform
      done();
    }.bind(this))
    .catch(function( reasons ) {
      // TODO
    });
};

module.exports = {
  Issues: Issues
};
