var Readable = require('stream').Readable;
var util = require('util');
var npm = require('npm');


function ViewVersion(config) {
	this._config = config;

	Readable.call(this, { objectMode: true });
}

util.inherits(ViewVersion, Readable);

ViewVersion.prototype._read = function() {
	var self = this,
		options = this._config;

	npm.load({}, function( err ) {
		if( err ) {
			self.emit( 'error', new Error( err.message ) );
		}

		// TODO get package name from package.json, not repo
		// Thanks https://github.com/stdarg/npmview/blob/master/index.js
		var silent = true;
		npm.commands.view([ options.repo ], silent, function( err, data ) {
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

module.exports.ViewVersion = ViewVersion;
