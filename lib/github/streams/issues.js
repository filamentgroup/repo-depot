var client = require('../client');
var paged = require('./paged');
var util = require('util');

function Issues(config, existing) {
  paged.Paged.call(this, {
    existing: existing,
    reqOptions: config,
    clientRequest: client.issues.repoIssues
  });
}

util.inherits(Issues, paged.Paged);

module.exports.Issues = Issues;
