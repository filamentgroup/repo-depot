/*
 * repo-depot
 * https://github.com/filamentgroup/repo-depot
 *
 * Copyright (c) 2015 Jeffrey Lembeck
 * Licensed under the MIT license.
 */


/*global require:true*/
/*global process:true*/
(function(){
  'use strict';

  var http = require( "https" );
  var URL = require( "url" );

  var opts = {
    hostname: 'api.github.com',
    port: 443,
    path: '/orgs/filamentgroup/repos',
    method: 'GET',
    headers: {
      'User-agent': 'repo-depot'
    }
  };

  var getNextLink = function( linkHeaders ){
    var next;
    if( linkHeaders ){
      next = linkHeaders.split( ',' ).filter(function(linkHeader){
        return linkHeader.match( "rel=\"next\"" );
      });
    }
    return next;
  };

  var deepClone = function( obj ){
    return JSON.parse( JSON.stringify( obj ) );
  };

  var getNextLinkURI = function( next ){
    var url, uri;
    url = next[0].split( ";" )[0];
    url = url.replace( /<(.*)>/, '$1' );
    uri = URL.parse( url );
    return uri;
  };


  var request = function( options ){
    var buffer = "";
    http.get( options, function(res){
      res.on( "data", function( data ){
        buffer += data.toString( "utf-8" );
      });

      res.on( "end", function(){
        var list = JSON.parse( buffer );
        list.forEach(function( repo ){
          process.stdout.write( repo.name + " " +
                                repo.html_url + " "  +
                                repo.open_issues + " " +
                                repo.updated_at + "\n" );
        });

        var next = getNextLink(res.headers.link);
        if( next && next.length ){
          var uri = getNextLinkURI(next);
          var clone = deepClone( options );
          clone.path = uri.path;
          request( clone );
        }
      });
    });
  };

  request(opts);

}());

