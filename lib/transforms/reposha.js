var stream = require('stream');
var util = require('util');

function RepoSha( data ) {
  this._data = data;
  stream.Transform.call(this, { objectMode: true });
}

util.inherits(RepoSha, stream.Transform);

RepoSha.prototype._transform = function(json, encode, done) {
  var user, repo, sha, jsonObj;

  jsonObj = JSON.parse(json);

  // TODO error any undefined
  // get the repo url from the url included in the json
  user = jsonObj.url.split("/")[4];
  repo = jsonObj.url.split("/")[5];
  sha = jsonObj.sha;

  this.push(user + "/" + repo + "/" + sha);
  done();
};

module.exports = RepoSha;
