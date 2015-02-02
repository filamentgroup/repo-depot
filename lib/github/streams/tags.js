var client = require('../client');
var paged = require('./paged');
var util = require('util');

function Tags(config, existing) {
  paged.Paged.call(this, {
    existing: existing,
    reqOptions: config,
    clientRequest: client.repos.getTags
  });
}

util.inherits(Tags, paged.Paged);

module.exports.Tags = Tags;
