function stream() {
  throw new Error( "stream must be implemented" );
}

function promise() {
  throw new Error( "promise must be implemented" );
}

function list() {
  return this._promise(this._list.bind(this));
}

function _list(listProp){
  return function(resolve, reject) {
    var list = [], stream = this._stream();

    stream.on('data', function( data ) {
      list.push( data[listProp] );
    });

    stream.on('end', function() {
      resolve( list );
    });
  };
}

function extend( constr, listProp ) {
  constr.prototype.list = list;
  constr.prototype._list = _list(listProp);

  // should be overwritten by other extension or assignment
  constr.prototype._promise = promise;
  constr.prototype._stream = stream;
}

module.exports.Listed = { extend: extend };
