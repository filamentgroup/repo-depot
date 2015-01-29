var transforms = require('./transforms');
var split = require('split');
var yargs = require('yargs');

// TODO:
// 1. Issues
// 2. Repo List
// 3. PRs
// 4. Checklist
// 5. --data-type=open,oldest
module.exports.run = function() {
  var args, subcommand, data;

  args = yargs
    .usage("Usage: $0 <subcommand> <data-type> [--data-type=<data-type>[,<data-typ>]]")
    .example("$0 issues open", "list the open issues, less PRs")
    .example("$0 issues oldest", "list the oldest issue")
    .demand(2)
    .check(function(args) {
      subcommand = args['_'][0];
      data = args['_'][1];

      if( !transforms[subcommand] ){
        throw new Error("unsupported subcommand");
      }

      if( !transforms[subcommand].supported[data] ){
        throw new Error("unsupported data type");
      }
    })
    .argv;

  process.stdin
    .pipe(split())
    .pipe(new transforms[subcommand]( data ))
    .pipe(process.stdout);
};
