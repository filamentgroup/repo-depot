var transforms = require('./transforms');
var split = require('split');
var yargs = require('yargs');

// TODO --data-type=open,oldest
// TODO support tree qualifier for filenames
module.exports.run = function() {
  var args, subcommand, data, extra;

  args = yargs
    .usage("Usage: $0 <subcommand> <data-type> [--data-type=<data-type>[,<data-type>]]")
    .example("$0 convert array", "convert input to a json array")
    .example("$0 convert template", "convert input to a templated output")
    .example("$0 filenames list", "list the files at the root of the project")
    .example("$0 issues open", "list the open issues, less PRs")
    .example("$0 issues oldest", "list the oldest issue date")
    .example("$0 repos list", "list all repos for a user")
    .example("$0 tags list", "list all tags for a repo")
    .example("$0 tags newest", "show the highest semver tag for a repo")
    .demand(2)
    .check(function(args) {
      var supported;

      subcommand = args['_'][0];
      data = args['_'][1];
      extra = args['_'].slice(2);

      if( !transforms[subcommand] ){
        throw new Error("unsupported subcommand");
      }

      supported = transforms[subcommand].supported[data];

      if( !supported ){
        throw new Error("unsupported data type");
      }

      if( typeof supported === "number"  && supported > extra.length ){
        throw new Error("data type requires more arguments");
      }
    })
    .argv;

  process.stdin
    .pipe(split())
    .pipe(new transforms[subcommand]( data, extra ))
    .pipe(process.stdout);
};
