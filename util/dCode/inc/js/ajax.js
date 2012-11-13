function ajax( object, file, callback, type, post ) {
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if( this.readyState == 4 && object !== null ) {
			var parser = new DOMParser();
			type === "xml" ? object[callback]( parser.parseFromString( this.responseText, "text/xml" ) ) :
				object[callback]( this.response ); } };
	if( post !== undefined ) {
		var params = [];
		for( var i in post )
			params.push(i+"="+post[i]);
		params = params.join("&");
		
		ajax.open( "post", file, true );
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		ajax.setRequestHeader("Content-length", params.length);
		ajax.setRequestHeader("Connection", "close");
		if( type === "arraybuffer" ) ajax.responseType = "arraybuffer";
		ajax.send( params );
	} else if( object === null ) {
		ajax.open( "get", file , false );
		if( type === "arraybuffer" ) ajax.responseType = "arraybuffer";
		ajax.send( null );
		return ajax.response;
	} else {
		ajax.open( "get", file );
		if( type === "arraybuffer" ) ajax.responseType = "arraybuffer";
		ajax.send( null );
	}
}