var client = require('../client');
var paged = require('./paged');
var util = require('util');

function Filenames(config, existing) {
  paged.Paged.call(this, {
    existing: existing,
    reqOptions: config,
    streamProp: 'tree',
    clientRequest: client.gitdata.getTree
  });
}

util.inherits(Filenames, paged.Paged);

module.exports.Filenames = Filenames;
