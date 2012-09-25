__$r.prototype.$Ajax = function( object, file, callback, type ) {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if( this.readyState == 4 ) {
			var parser = new DOMParser();
			type === "xml" ? object[callback]( parser.parseFromString( this.responseText, "text/xml" ) ) :
				object[callback]( this.responseText ); } };
	ajax.open( "get", file );
	ajax.send( null );
}