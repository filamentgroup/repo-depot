var Readable = require('stream').Readable;
var util = require('util');
var npm = require('npm');


function Search(config) {
	this._config = config;

	Readable.call(this, { objectMode: true });
}

util.inherits(Search, Readable);

Search.prototype._read = function() {
	var self = this,
		options = this._config;

	npm.load( {}, function( err ) {
		if( err ) {
			self.emit( 'error', new Error( err.message ) );
		}

		// TODO get package name from package.json, not repo
		npm.commands.view([ options.repo ], function( err, data ) {
			if( err ) {
				self.emit( 'error', new Error( err.message ) );
			}

			for( var key in data ) {
				console.log( data[ key ][ 'dist-tags' ].latest );
				this._data = data[ key ];
			}
		});
	});

	this.push(null);
};

module.exports.Search = Search;
