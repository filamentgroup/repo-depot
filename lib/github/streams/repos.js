var client = require('../client');
var paged = require('./paged');
var util = require('util');

function Repos(config, existing) {
  paged.Paged.call(this, {
    existing: existing,
    reqOptions: config,
    clientRequest: client.repos.getFromUser
  });
}

util.inherits(Repos, paged.Paged);

module.exports.Repos = Repos;
