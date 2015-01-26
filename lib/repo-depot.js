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
      'User-agent': 'jefflembeck'
    }
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
          process.stdout.write( repo.html_url + " ");
        });

        var next;
        var linkHeaders = res.headers.link;
        if( linkHeaders ){
          next = linkHeaders.split( ',' ).filter(function(linkHeader){
            return linkHeader.match( "rel=\"next\"" );
          });
        }
        if( next && next.length ){
          var url = next[0].split( ";" )[0];
          url = url.replace( /<(.*)>/, '$1' );
          var uri = URL.parse( url );
          var clone = JSON.parse( JSON.stringify( options ) );
          clone.path = uri.path;
          request( clone );
        }
      });
    });
  };

  request(opts);

}());

