var client = require('../client');
var paged = require('./paged');
var util = require('util');

function Repos(user, existing) {
  paged.Paged.call(this, {
    existing: existing,
    reqOptions: { user: user },
    clientRequest: client.repos.getFromUser
  });
}

util.inherits(Repos, paged.Paged);

module.exports.Repos = Repos;
