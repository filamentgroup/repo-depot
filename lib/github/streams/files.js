var client = require('../client');
var paged = require('./paged');
var util = require('util');

function Files(config, existing) {
  paged.Paged.call(this, {
    existing: existing,
    reqOptions: config,
    streamProp: 'tree',
    clientRequest: client.gitdata.getTree
  });
}

util.inherits(Files, paged.Paged);

module.exports.Files = Files;
