'use strict';

// relative to the nodeunit binary?
var streams = require('../../../lib/github/streams');

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

    this.stream._nextPage = this.stream._initialPage = function() {};

    done();
  },

  '_newPage emits error': function(test) {
    test.expect(1);

    this.stream.emit = function() {
      test.ok( true, "emit called" );
      test.done();
    };

    this.stream._newPage("fake error object", undefined);
  },

  '_read makes new call when no page is present': function(test) {
    test.expect(1);

    this.stream.on('data', function() {
       test.ok(false, "read should not call push");
    });

    this.stream._initialPage = function() {
      test.ok(true, "test should make a client call");
      test.done();
    };

    this.stream._read();
  },

  '_read pushes item if page has one': function(test) {
    test.expect(1);

    this.stream.page = ['baz'];

    this.stream.push = function( issue ) {
      test.equal(issue, "baz");
      test.done();
    };

    this.stream._read();
  },

  '_read grabs the next page if page is empty': function(test) {
    test.expect(1);

    this.stream.page = [];

    this.stream._nextPage = function() {
      test.ok(true);
      test.done();
    };

    this.stream._read();
  }
};
