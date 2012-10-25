__$r.prototype.$Ajax = function( object, file, callback, type, post ) {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if( this.readyState == 4 ) {
			var parser = new DOMParser();
			type === "xml" ? object[callback]( parser.parseFromString( this.responseText, "text/xml" ) ) :
				object[callback]( this.responseText ); } };
	if( post !== undefined ) {
		var params = [];
		for( var i in post )
			params.push(i+"="+post[i]);
		params = params.join("&");
		
		ajax.open( "post", file, true );
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		ajax.setRequestHeader("Content-length", params.length);
		ajax.setRequestHeader("Connection", "close");
		ajax.send( params );
	} else {
		ajax.open( "get", file );
		ajax.send( null );
	}
}