var client = require('../client');
var paged = require('./paged');
var util = require('util');

function Issues(user, repo, existing) {
  paged.Paged.call(this, {
    existing: existing,
    reqOptions: {
      user: user,
      repo: repo
    },
    clientRequest: client.issues.repoIssues
  });
}

util.inherits(Issues, paged.Paged);

module.exports.Issues = Issues;
