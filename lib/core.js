var transforms = require('./transforms');
var split = require('split');
var yargs = require('yargs');

// TODO [--data-type=<data-type>[,<data-type>]]
// TODO support tree qualifier for filenames
module.exports.run = function() {
  var args, subcommand, data, extra;

  args = yargs
    .usage("Usage: $0 <subcommand> <data-type> [<param>[ <param>]]")
    .example("$0 convert array", "convert input to a json array")
    .example("$0 convert template <template-path>", "convert input to a templated output")
    .example("$0 acc template <template-path>", "gather all input into templated output")
    .example("$0 files list", "list the files at the root of the project")
    .example("$0 files json", "output json for a file")
    .example("$0 files out", "output content of a file")
    .example("$0 blob out", "output blob for a sha")
    .example("$0 issues open", "list the open issues, less PRs")
    .example("$0 issues oldest", "list the oldest issue date")
    .example("$0 repos list", "list all repos for a user")
    .example("$0 search list", "search npm for a package")
    .example("$0 tags list", "list all tags for a repo")
    .example("$0 tags newest", "show the highest semver tag for a repo")
    .demand(2)
    .check(function(args) {
      var supported;

      subcommand = args['_'][0];
      data = args['_'][1];
      extra = args['_'].slice(2);

      if( !transforms[subcommand] ){
        throw new Error("unsupported subcommand: " + subcommand);
      }

      supported = transforms[subcommand].supported[data];

      if( !supported ){
        throw new Error("unsupported data type: " + data);
      }

      if( typeof supported === "number" && supported > extra.length ){
        throw new Error("data type requires more arguments");
      }
    })
    .argv;

  var exit, stream;

  stream = process.stdin.pipe(split());

  exit = function( err ) {
    console.log(err.stack);
    process.exit(1);
  };

  if( subcommand == "files" && data == "out" ) {
    stream = stream
      .pipe(new transforms.files("json", extra))
      .on( 'error', exit )
      .pipe(new transforms.reposha(data))
      .on( 'error', exit )
      .pipe(new transforms.blob(data, extra))
      .on( 'error', exit );
  } else {
    stream = stream
      .pipe(new transforms[subcommand]( data, extra ))
      .on( 'error', exit );
  }

  stream = stream.pipe(process.stdout);
};
