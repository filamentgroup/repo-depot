'use strict';

// relative to the nodeunit binary?
var streams = require('../../lib/github/streams');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['issues'] = {
  setUp: function(done) {
    this.stream = new streams.Issues("foo", "bar");
    done();
  },
  '_newPage emits error': function(test) {
    test.expect(1);

    this.stream.emit = function() {
      test.ok( true, "emit called" );
      test.done();
    };

    this.stream._newPage({}, undefined);
  }
};
