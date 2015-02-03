'use strict';

var Paged = require('../../../lib/github/streams/paged').Paged;

exports['paged'] = {
  setUp: function(done) {
    this.stream = new Paged({});

    this.stream.push = this.stream._nextPage = this.stream._initialPage = function() {};

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

    // TODO remove the push mocks and just use streams
    this.stream.push = function() {
       test.ok(false, "read should not call push");
    };

    this.stream._initialPage = function() {
      test.ok(true, "test should make a client call");
      test.done();
    };

    this.stream._read();
  },

  '_read pushes item if page has one': function(test) {
    test.expect(1);

    this.stream._page = ['baz'];

    // TODO remove the push mocks and just use streams
    this.stream.push = function( issue ) {
      test.equal(issue, "baz");
      test.done();
    };

    this.stream._read();
  },

  '_read grabs the next page if page is empty': function(test) {
    test.expect(1);

    this.stream._page = [];

    this.stream._nextPage = function() {
      test.ok(true);
      test.done();
    };

    this.stream._read();
  },

  '_read caches each element': function(test) {
    this.stream._page = [ 'foo', 'bar' ];
    this.stream._read();
    this.stream._read();

    test.deepEqual(this.stream._page, []);
    test.deepEqual(this.stream._cache, [ 'foo', 'bar' ]);
    test.done();
  },

  '_nextPage shouldnt get the next page when cache is complete': function(test) {
    test.expect(1);

    // reset
    this.stream._nextPage = Paged.prototype._nextPage;

    this.stream._client = {
      hasNextPage: function() {
        return true;
      },

      getNextPage: function() {
        test.ok(false, "shouldn't be called when cache is complete");
      }
    };

    this.stream._cachingComplete = true;
    this.stream.push = function(pushed) {
      test.equal(pushed, null);
    };

    this.stream._nextPage();
    test.done();
  },

  '_nextPage marks caching complete': function(test) {
    test.expect(1);

    // reset
    this.stream._nextPage = Paged.prototype._nextPage;

    this.stream._client = {
      hasNextPage: function() {
        return false;
      }
    };

    this.stream._cachingComplete = false;

    this.stream._nextPage();
    test.ok(this.stream._cachingComplete);
    test.done();
  }
};
